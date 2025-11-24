require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/products');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const seedRoutes = require('./routes/seed');
const productCategories = require('./routes/productCategories');
const serviceCategories = require('./routes/serviceCategories');
const multer = require('multer');
const fs = require('fs');

const app = express();

// ensure uploads dir
const UPLOAD_DIR = 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
// Enable CORS with explicit options for clearer behavior in dev
const corsOptions = {
  origin: (origin, callback) => {
    // Allow all origins in development. In production restrict this.
    callback(null, true);
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
};

// Enable CORS early so it applies to static file responses as well
app.use(cors(corsOptions));
// Serve uploads with a permissive CORS header to avoid origin-specific cache issues at the CDN/edge.
// This sets Access-Control-Allow-Origin: * for static files and removes credentials so it is safe with CDNs.
app.use('/uploads', (req, res, next) => {
  // Only set permissive CORS for safe methods
  if (req.method === 'GET' || req.method === 'HEAD') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Remove credentials header if global CORS set it earlier
    try { res.removeHeader('Access-Control-Allow-Credentials'); } catch (e) {}
  }
  next();
}, express.static(UPLOAD_DIR));
// Explicitly respond to preflight requests
app.options('*', cors(corsOptions));

// Simple request logger to help diagnose network/CORS issues
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl, 'from', req.ip);
  // attach a small response header to confirm CORS headers are present
  res.setHeader('X-Server-Time', new Date().toISOString());
  next();
});

app.use(express.json());

// Global error handlers for visibility
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGODB_URI || 'mongodb+srv://aivstudios:aivstudios%40123@sa-marble.speltli.mongodb.net/';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed default categories if missing
const ProductCategory = require('./models/ProductCategory');
const ServiceCategory = require('./models/ServiceCategory');

const seedDefaultCategories = async () => {
  try {
    const defaultProductCats = ['Marble','Granite','Tiles','Solid work','Mosaic','Floor border','Bowl'];
    for (const name of defaultProductCats) {
      await ProductCategory.updateOne({ name }, { name }, { upsert: true });
    }

    const defaultServiceCats = ['Floor work','Kitchen Work','Basin (sink) Work','Stairs work','Wall work'];
    for (const name of defaultServiceCats) {
      await ServiceCategory.updateOne({ name }, { name }, { upsert: true });
    }
    console.log('Default categories ensured');
  } catch (err) {
    console.error('Failed to seed default categories', err);
  }
};

seedDefaultCategories();

app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/categories/products', productCategories);
app.use('/api/categories/services', serviceCategories);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Temporary debug endpoint to list files in uploads (for debugging on Koyeb). Remove after verification.
app.get('/api/debug/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map(name => {
      try {
        const stat = fs.statSync(require('path').join(UPLOAD_DIR, name));
        return { name, size: stat.size, mtime: stat.mtime };
      } catch (e) {
        return { name, error: String(e) };
      }
    });
    res.json({ ok: true, count: files.length, files });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
