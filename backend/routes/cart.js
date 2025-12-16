const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.get('/:sessionId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ sessionId: req.params.sessionId });
        if (!cart) {
            cart = new Cart({ sessionId: req.params.sessionId, items: [], total: 0 });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:sessionId/add', async (req, res) => {
    try {
        let cart = await Cart.findOne({ sessionId: req.params.sessionId });
        if (!cart) cart = new Cart({ sessionId: req.params.sessionId, items: [], total: 0 });
        const { name, price } = req.body;
        const existingItem = cart.items.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ name, price, quantity: 1 });
        }
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:sessionId/update', async (req, res) => {
    try {
        const cart = await Cart.findOne({ sessionId: req.params.sessionId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        const { name, quantity } = req.body;
        const item = cart.items.find(item => item.name === name);
        if (item) {
            if (quantity <= 0) {
                cart.items = cart.items.filter(item => item.name !== name);
            } else {
                item.quantity = quantity;
            }
        }
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:sessionId/remove/:itemName', async (req, res) => {
    try {
        const cart = await Cart.findOne({ sessionId: req.params.sessionId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter(item => item.name !== req.params.itemName);
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:sessionId/clear', async (req, res) => {
    try {
        const cart = await Cart.findOne({ sessionId: req.params.sessionId });
        if (cart) {
            cart.items = [];
            cart.total = 0;
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;