const express = require('express');

module.exports = (productManager, io) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getAllProducts();
            res.json(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.pid);
            if (!product) return res.status(404).send('Producto no encontrado');
            res.json(product);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;

            if (!title || !description || !code || !price || typeof status !== 'boolean' || !stock || !category || !Array.isArray(thumbnails)) {
                return res.status(400).send('Datos incompletos o inválidos');
            }

            const newProduct = await productManager.addProduct(req.body);
            io.emit('updateProducts', newProduct);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
            if (!updatedProduct) return res.status(404).send('Producto no encontrado');
            res.json(updatedProduct);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const success = await productManager.deleteProduct(req.params.pid);
            if (!success) return res.status(404).send('Producto no encontrado');

            io.emit('removeProduct', req.params.pid);
            res.send('Producto eliminado');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

    return router;
};