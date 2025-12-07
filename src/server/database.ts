import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'cc-WORDS.sqlite');
const db = new Database(dbPath);

export interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  example?: string;
  exampleMeaning?: string;
  frequency: number;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'frequency' | 'pinyin';
}

// Get all entries or search
export function searchDictionary(query: string = '', options: QueryOptions = {}): DictionaryEntry[] {
  const { limit = 1000, offset = 0, sortBy = 'frequency' } = options;

  let sql = `
    SELECT 
      rowid as id,
      simp as simplified,
      trad as traditional,
      pinyin,
      meaning,
      freq as frequency
    FROM WORDS
  `;

  const params: (string | number)[] = [];

  if (query.trim()) {
    sql += ` WHERE simp LIKE ? OR trad LIKE ? OR pinyin LIKE ? OR meaning LIKE ?`;
    const searchTerm = `%${query}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (sortBy === 'frequency') {
    sql += ` ORDER BY freq DESC`;
  } else {
    sql += ` ORDER BY pinyin ASC`;
  }

  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  try {
    const stmt = db.prepare(sql);
    const results = stmt.all(...params) as DictionaryEntry[];
    return results.map(entry => ({
      ...entry,
      frequency: entry.frequency || 0,
    }));
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
}

// Get single entry
export function getEntry(simplified: string): DictionaryEntry | null {
  const sql = `
    SELECT 
      rowid as id,
      simp as simplified,
      trad as traditional,
      pinyin,
      meaning,
      freq as frequency
    FROM WORDS
    WHERE simp = ?
  `;

  try {
    const stmt = db.prepare(sql);
    const result = stmt.get(simplified) as DictionaryEntry | undefined;
    return result || null;
  } catch (error) {
    console.error('Database query error:', error);
    return null;
  }
}

// Get total count
export function getTotalCount(query: string = ''): number {
  let sql = `SELECT COUNT(*) as count FROM WORDS`;
  const params: string[] = [];

  if (query.trim()) {
    sql += ` WHERE simp LIKE ? OR trad LIKE ? OR pinyin LIKE ? OR meaning LIKE ?`;
    const searchTerm = `%${query}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  try {
    const stmt = db.prepare(sql);
    const result = stmt.get(...params) as { count: number };
    return result.count;
  } catch (error) {
    console.error('Database query error:', error);
    return 0;
  }
}

// Close database connection
export function closeDatabase(): void {
  db.close();
}

export default db;
