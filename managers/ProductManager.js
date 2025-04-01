const fs = require('fs');
const path = './data/products.json';

class ProductManager {
    async getAllProducts() {
        try {
            const data = fs.readFileSync(path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Hubo un error leyendo el archivo de productos:', error);
            return [];
        }
    }

    async saveProducts(products) {
        try {
            fs.writeFileSync(path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Hubo un error escribiendo en el archivo de productos:', error);
        }
    }

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === id) || null;
    }

    async addProduct(product) {
        const products = await this.getAllProducts();
        const newProduct = { id: Date.now().toString(), ...product };

        const existingProduct = products.find(p => p.code === product.code);
        if (existingProduct) {
            console.error(`Producto con código ${product.code} ya existe`);
            return null;
        }

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, data) {
        const products = await this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            console.error(`Producto con ID ${id} no encontrado`);
            return null;
        }

        products[index] = { ...products[index], ...data, id: products[index].id };
        await this.saveProducts(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getAllProducts();
        const filteredProducts = products.filter(p => p.id !== id);

        if (products.length === filteredProducts.length) {
            console.error(`Producto con ID ${id} no encontrado`);
            return false;
        }

        await this.saveProducts(filteredProducts);
        return true;
    }
}

module.exports = ProductManager;