const express = require('express');
const app = express();

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).send('Error interno del servidor');
});

app.listen(8080, () => {
    console.log('Servidor en el puerto 8080');
});