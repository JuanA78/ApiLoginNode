const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Habilitar CORS para todos los orígenes
app.use(cors()); // 👈 Esto permite acceso desde cualquier dominio

// También podrías personalizar CORS así si lo prefieres:
// app.use(cors({
//   origin: '*', // cualquier origen
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
