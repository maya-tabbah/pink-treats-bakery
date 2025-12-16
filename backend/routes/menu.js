const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ available: true });
        const grouped = menuItems.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {});
        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ category: req.params.category, available: true });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const menuItem = new MenuItem({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description
    });
    try {
        const newItem = await menuItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;