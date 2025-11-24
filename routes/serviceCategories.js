const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');

router.get('/', async (req, res) => {
  try {
    const items = await ServiceCategory.find().sort({ name: 1 });
    res.json(items.map(i => ({ id: i._id.toString(), name: i.name })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const exist = await ServiceCategory.findOne({ name });
    if (exist) return res.status(200).json({ id: exist._id.toString(), name: exist.name });
    const c = new ServiceCategory({ name });
    await c.save();
    res.status(201).json({ id: c._id.toString(), name: c.name });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
