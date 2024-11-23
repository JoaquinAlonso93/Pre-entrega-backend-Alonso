const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsFilePath = './src/data/products.json';

// Función para leer productos desde el archivo
const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
        fs.writeFileSync(productsFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
};

// Función para guardar productos en el archivo
const saveProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Obtener todos los productos
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = { ...req.body, id: products.length ? products[products.length - 1].id + 1 : 1, status: true };
    
    // Validar campos obligatorios
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
        if (!newProduct[field]) {
            return res.status(400).json({ error: `El campo ${field} es obligatorio` });
        }
    }
    
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.pid));
    
    if (index !== -1) {
        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;
        saveProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const newProducts = products.filter(p => p.id !== parseInt(req.params.pid));
    
    if (newProducts.length < products.length) {
        saveProducts(newProducts);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = router;