const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const mapDoc = (doc) => {
  const obj = doc.toObject({ getters: true });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

router.get('/', async (req, res) => {
  try {
    const items = await Order.find().sort({ createdAt: -1 });
    res.json(items.map(mapDoc));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    const o = new Order(data);
    await o.save();
    res.status(201).json(mapDoc(o));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json(mapDoc(o));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    const o = await Order.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json(mapDoc(o));
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

module.exports = router;
