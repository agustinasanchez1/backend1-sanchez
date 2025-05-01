const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

const ProductManager = require('./managers/ProductManager');
const CartManager = require('./managers/CartManager');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager();
const cartManager = new CartManager();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());

app.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
});

app.use('/api/products', productsRouter(productManager, io));
app.use('/api/carts', cartsRouter(cartManager));

app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});