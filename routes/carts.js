const express = require('express');
const router = express.Router();

const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Ocurrió un error al crear el carrito:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');
        res.json(cart);
    } catch (error) {
        console.error('Ocurrió un error al obtener el carrito:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!updatedCart) return res.status(404).send('Carrito o producto no encontrado');
        res.json(updatedCart);
    } catch (error) {
        console.error('Ocurrió un error al agregar el producto al carrito:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

module.exports = router;