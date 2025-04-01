const express = require('express');
const router = express.Router();

const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Ocurrió un error al obtener los productos:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.json(product);
    } catch (error) {
        console.error('Ocurrió un error al obtener el producto:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || typeof status !== 'boolean' || !stock || !category || !Array.isArray(thumbnails)) {
            return res.status(400).send('Datos incompletos o inválidos');
        }

        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Ocurrió un error al agregar el producto:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) return res.status(404).send('Producto no encontrado');
        res.json(updatedProduct);
    } catch (error) {
        console.error('Ocurrió un error al actualizar el producto:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const success = await productManager.deleteProduct(req.params.pid);
        if (!success) return res.status(404).send('Producto no encontrado');
        res.send('Producto eliminado');
    } catch (error) {
        console.error('Ocurrió un error al eliminar el producto:', error);
        res.status(500).send('Ocurrió un error interno del servidor');
    }
});

module.exports = router;