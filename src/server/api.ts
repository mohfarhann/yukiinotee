import express, { Request, Response } from 'express';
import cors from 'cors';
import { searchDictionary, getEntry, getTotalCount } from './database.js';

const app = express();
const PORT = 3001;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Search dictionary
app.get('/api/dictionary/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const limit = parseInt(req.query.limit as string) || 1000;
  const offset = parseInt(req.query.offset as string) || 0;
  const sortBy = (req.query.sortBy as 'frequency' | 'pinyin') || 'frequency';

  try {
    const results = searchDictionary(query, { limit, offset, sortBy });
    const total = getTotalCount(query);
    
    res.json({
      success: true,
      data: results,
      total,
      query,
      limit,
      offset,
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search dictionary',
    });
  }
});

// Get single entry
app.get('/api/dictionary/entry/:simplified', (req: Request, res: Response) => {
  const { simplified } = req.params;

  try {
    const entry = getEntry(simplified);
    
    if (entry) {
      res.json({
        success: true,
        data: entry,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Entry not found',
      });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get entry',
    });
  }
});

// Get total count
app.get('/api/dictionary/count', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';

  try {
    const total = getTotalCount(query);
    
    res.json({
      success: true,
      total,
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get count',
    });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`📚 Dictionary API server running on http://localhost:${PORT}`);
});
