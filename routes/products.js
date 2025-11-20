const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage });

const mapDoc = (doc) => {
  const obj = doc.toObject({ getters: true });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

router.get('/', async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items.map(mapDoc));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Accept either multiple files named 'images' (or 'images[]') or a single 'image'
router.post('/', upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'images[]', maxCount: 3 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    // Normalize uploaded files
    let uploadedFiles = [];
    if (req.files) {
      if (Array.isArray(req.files)) uploadedFiles = req.files;
      else {
        Object.keys(req.files).forEach((k) => {
          const arr = req.files[k];
          if (Array.isArray(arr)) uploadedFiles.push(...arr);
        });
      }
    }

    if (uploadedFiles.length) {
      // enforce limit server-side as additional defense
      if (uploadedFiles.length > 3) return res.status(400).json({ error: 'Maximum 3 images allowed for products' });
      data.images = uploadedFiles.map(f => '/uploads/' + f.filename);
      // preserve compatibility: set `image` to first
      data.image = data.images[0];
    } else if (typeof data.images === 'string') {
      try { data.images = JSON.parse(data.images); } catch (e) { data.images = [data.images]; }
      if (Array.isArray(data.images) && data.images.length) data.image = data.images[0];
    }
    const p = new Product(data);
    await p.save();
    res.status(201).json(mapDoc(p));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(mapDoc(p));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.put('/:id', upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'images[]', maxCount: 3 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    let uploadedFiles = [];
    if (req.files) {
      if (Array.isArray(req.files)) uploadedFiles = req.files;
      else {
        Object.keys(req.files).forEach((k) => {
          const arr = req.files[k];
          if (Array.isArray(arr)) uploadedFiles.push(...arr);
        });
      }
    }
    if (uploadedFiles.length) {
      if (uploadedFiles.length > 3) return res.status(400).json({ error: 'Maximum 3 images allowed for products' });
      data.images = uploadedFiles.map(f => '/uploads/' + f.filename);
      data.image = data.images[0];
    } else if (typeof data.images === 'string') {
      try { data.images = JSON.parse(data.images); } catch (e) { data.images = [data.images]; }
      if (Array.isArray(data.images) && data.images.length) data.image = data.images[0];
    }
    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(mapDoc(p));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

module.exports = router;
