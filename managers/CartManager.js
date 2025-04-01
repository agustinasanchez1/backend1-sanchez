const fs = require('fs');
const cartPath = './data/carts.json';
const productPath = './data/products.json';

class CartManager {
    async getAllCarts() {
        try {
            const data = fs.readFileSync(cartPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Hubo un error leyendo el archivo de carritos:', error);
            return [];
        }
    }

    async saveCarts(carts) {
        try {
            fs.writeFileSync(cartPath, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Hubo un error escribiendo en el archivo de carritos:', error);
        }
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            console.error(`Carrito con ID ${cartId} no encontrado`);
            return null;
        }

        const products = JSON.parse(fs.readFileSync(productPath, 'utf-8'));
        const product = products.find(product => product.id === productId);
        if (!product) {
            console.error(`Producto con ID ${productId} no encontrado`);
            return null;
        }

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveCarts(carts);
        return cart;
    }
}

module.exports = CartManager;