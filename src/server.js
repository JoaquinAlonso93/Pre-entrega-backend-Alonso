const express = require('express');
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

// Rutas
app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/carts'));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});