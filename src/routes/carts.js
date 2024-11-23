const express = require('express');
const fs = require('fs');
 const router = express.Router();
const cartsFilePath = './src/data/carts.json';

// Función para leer carritos desde el archivo
const readCarts = () => {
    if (!fs.existsSync(cartsFilePath)) {
        fs.writeFileSync(cartsFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
};

// Función para guardar carritos en el archivo
const saveCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (cart) {
        const productId = parseInt(req.params.pid);
        const existingProduct = cart.products.find(p => p.product === productId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        saveCarts(carts);
        res.status(200).json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

module.exports = router;