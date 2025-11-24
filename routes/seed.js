const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Service = require('../models/Service');

router.post('/products', async (req, res) => {
  try {
    const items = req.body || [];
    // remove existing for clean seed
    await Product.deleteMany({});
    // strip client ids before insert
    const clean = items.map(i => {
      const copy = { ...i };
      delete copy.id;
      return copy;
    });
    const created = await Product.insertMany(clean);
    const mapped = created.map(c => ({ ...c.toObject(), id: c._id.toString(), _id: undefined }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/services', async (req, res) => {
  try {
    const items = req.body || [];
    await Service.deleteMany({});
    const clean = items.map(i => {
      const copy = { ...i };
      delete copy.id;
      return copy;
    });
    const created = await Service.insertMany(clean);
    const mapped = created.map(c => ({ ...c.toObject(), id: c._id.toString(), _id: undefined }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
