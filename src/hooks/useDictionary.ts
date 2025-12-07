import { useEffect, useState, useCallback } from 'react';
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import localforage from 'localforage';
import { AIQuizResponse } from '../services/gemini';

localforage.config({
  name: 'yuki-dictionary',
  storeName: 'database'
});

export interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  frequency?: number;
}

export interface SavedQuestion {
  question_id: number;
  question_text: string;
  question_type: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer_key: string;
  explanation: string;
  created_at?: string;
}

interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'frequency' | 'pinyin';
}

let SQL: SqlJsStatic | null = null;
let cachedDb: Database | null = null;

async function initializeDatabase(): Promise<Database> {
  if (cachedDb) return cachedDb;

  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });
  }

  try {
    // 1. Try to load from Local Storage (Persistence)
    const savedDb = await localforage.getItem<Uint8Array>('cedict_db');

    if (savedDb) {
      console.log('Loaded database from local persistence');
      cachedDb = new SQL.Database(savedDb);
    } else {
      // 2. If not found, fetch from server/public folder
      console.log('Fetching database from server...');
      let buffer: ArrayBuffer;

      try {
        const response = await fetch('/cc-cedict.sqlite');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        buffer = await response.arrayBuffer();
      } catch (err) {
        console.warn('Failed to fetch from /cc-cedict.sqlite, trying alternative path', err);
        const response = await fetch('/public/cc-cedict.sqlite');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        buffer = await response.arrayBuffer();
      }

      // Verify it's a valid SQLite file
      const dataView = new DataView(buffer);
      const magic = String.fromCharCode(
        dataView.getUint8(0),
        dataView.getUint8(1),
        dataView.getUint8(2),
        dataView.getUint8(3)
      );

      if (magic !== 'SQLi') {
        throw new Error(`Invalid SQLite file. Got magic: ${magic.split('').map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
      }

      cachedDb = new SQL.Database(new Uint8Array(buffer));
    }

    // Initialize Quiz Table if not exists
    cachedDb.run(`
      CREATE TABLE IF NOT EXISTS single_quiz_table (
        question_id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT,
        option_d TEXT,
        correct_answer_key VARCHAR(1) NOT NULL,
        explanation TEXT,
        created_at TEXT
      )
    `);

    // Migration logic
    try {
      // Check if column exists, if not, create it
      const res = cachedDb.exec("PRAGMA table_info(single_quiz_table)");
      const columns = res[0].values.map(val => val[1]);
      if (!columns.includes('created_at')) {
        cachedDb.run("ALTER TABLE single_quiz_table ADD COLUMN created_at TEXT");
      }
    } catch (e) {
      console.error("Migration error:", e);
    }

    // Save migration result
    try {
      const binary = cachedDb.export();
      await localforage.setItem('cedict_db', binary);
    } catch (e) {
      console.warn("Failed to checkpont DB after migration");
    }

    console.log('Database initialized');
    return cachedDb;
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

export function useDictionary() {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const database = await initializeDatabase();
        setDb(database);
        setError(null);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const search = useCallback((query: string = '', options: QueryOptions = {}): DictionaryEntry[] => {
    if (!db) return [];

    const { limit = 1000, offset = 0, sortBy = 'frequency' } = options;

    let sql = `
      SELECT 
        id,
        simplified,
        traditional,
        pronunciation as pinyin,
        definitions as meaning
      FROM Words
    `;

    const params: (string | number)[] = [];

    if (query.trim()) {
      sql += ` WHERE simplified LIKE ? OR traditional LIKE ? OR pronunciation LIKE ? OR definitions LIKE ?`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (sortBy === 'frequency') {
      sql += ` ORDER BY id DESC`;
    } else {
      sql += ` ORDER BY pronunciation ASC`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results: DictionaryEntry[] = [];

      while (stmt.step()) {
        const row = stmt.getAsObject() as Record<string, unknown>;
        results.push({
          id: row.id as number,
          simplified: row.simplified as string,
          traditional: row.traditional as string,
          pinyin: row.pinyin as string,
          meaning: row.meaning as string,
        });
      }

      stmt.free();
      return results;
    } catch (err) {
      console.error('Query error:', err);
      return [];
    }
  }, [db]);

  const getTotalCount = useCallback((query: string = ''): number => {
    if (!db) return 0;

    let sql = `SELECT COUNT(*) as count FROM Words`;
    const params: string[] = [];

    if (query.trim()) {
      sql += ` WHERE simplified LIKE ? OR traditional LIKE ? OR pronunciation LIKE ? OR definitions LIKE ?`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      let count = 0;

      if (stmt.step()) {
        const row = stmt.getAsObject() as { count: number };
        count = row.count;
      }

      stmt.free();
      return count;
    } catch (err) {
      console.error('Count query error:', err);
      return 0;
    }
  }, [db]);

  const saveQuizQuestions = useCallback(async (questions: AIQuizResponse[]) => {
    if (!db) return;
    try {
      const now = new Date().toISOString();
      db.run("BEGIN TRANSACTION");
      const stmt = db.prepare(`
        INSERT INTO single_quiz_table (
            question_text, 
            question_type, 
            option_a, 
            option_b, 
            option_c, 
            option_d, 
            correct_answer_key, 
            explanation,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      questions.forEach(q => {
        stmt.run([
          q.question,
          'Multiple Choice',
          q.options.a,
          q.options.b,
          q.options.c,
          q.options.d,
          q.answer,
          q.explanation,
          now
        ]);
      });

      stmt.free();
      db.run("COMMIT");
      console.log("Questions committed to memory");

      // Persist to disk (IndexedDB)
      try {
        const binary = db.export();
        await localforage.setItem('cedict_db', binary);
        console.log('Database state saved to local storage');
      } catch (e) {
        console.error('Failed to persist database:', e);
      }

    } catch (err) {
      console.error("Error saving questions:", err);
      db.exec("ROLLBACK");
    }
  }, [db]);

  const getSavedQuestions = useCallback((): SavedQuestion[] => {
    if (!db) return [];
    try {
      // Ensure table exists just in case (e.g. if loaded from old persistence without table)
      db.run(`
        CREATE TABLE IF NOT EXISTS single_quiz_table (
          question_id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_text TEXT NOT NULL,
          question_type VARCHAR(50) NOT NULL,
          option_a TEXT NOT NULL,
          option_b TEXT NOT NULL,
          option_c TEXT,
          option_d TEXT,
          correct_answer_key VARCHAR(1) NOT NULL,
          explanation TEXT,
          created_at TEXT
        )
      `);

      const result = db.exec("SELECT * FROM single_quiz_table ORDER BY question_id DESC");
      if (result.length === 0) return [];

      const columns = result[0].columns;
      const values = result[0].values;

      return values.map(val => {
        const row: any = {};
        columns.forEach((col, i) => {
          row[col] = val[i];
        });
        return row as SavedQuestion;
      });
    } catch (err) {
      console.error("Error fetching saved questions:", err);
      return [];
    }
  }, [db]);

  return {
    db,
    loading,
    error,
    search,
    getTotalCount,
    saveQuizQuestions,
    getSavedQuestions
  };
}
