import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();
// Render asigna el puerto automáticamente en la variable PORT.
// Si no existe (local), usa el 3001 que tienes definido.
const port = process.env.PORT || 3001; 

// --- CONFIGURACIÓN DE CORS ---
const allowedOrigins = [
  'http://localhost:5173',            // Tu entorno local
  'http://localhost:3001',            // Postman o pruebas
  'https://pizza42-app.onrender.com', // URL original de Render Frontend
  'https://pizza42.store',            // TU DOMINIO
  'https://www.pizza42.store'         // Tu dominio con www
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `La política CORS no permite acceso desde: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// --- 1. MIDDLEWARE DE AUTENTICACIÓN ---
const checkJwt = auth({
  // Usamos tu variable VITE_AUTH0_AUDIENCE que ya contiene "https://api.pizza42.com"
  audience: process.env.VITE_AUTH0_AUDIENCE || 'https://api.pizza42.com',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// --- 2. FUNCIÓN PARA OBTENER EL TOKEN M2M ---
const getManagementToken = async () => {
  try {
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      // AQUÍ LA CORRECCIÓN: Usamos tus nombres de variables M2M
      client_id: process.env.M2M_CLIENT_ID,
      client_secret: process.env.M2M_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error obteniendo token M2M:", error.response?.data || error.message);
    throw error;
  }
};

// --- 3. RUTA DE PEDIDOS ---
app.post('/api/orders', checkJwt, async (req, res) => {
  try {
    const newOrder = req.body;
    const userId = req.auth.payload.sub; 

    console.log(`🍕 Recibiendo pedido para usuario: ${userId}`);

    // A. Obtener token de administración
    const managementToken = await getManagementToken();

    // B. Leer historial actual
    const userUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`;
    
    let currentOrders = [];
    try {
        const userResponse = await axios.get(userUrl, {
            headers: { Authorization: `Bearer ${managementToken}` }
        });
        currentOrders = userResponse.data.user_metadata?.orders || [];
    } catch (e) {
        console.log("Iniciando historial vacío para usuario nuevo.");
    }
    
    // C. Agregar y Guardar
    currentOrders.push(newOrder);

    await axios.patch(userUrl, 
      { user_metadata: { orders: currentOrders } },
      { headers: { Authorization: `Bearer ${managementToken}` } }
    );

    res.status(200).json({ message: 'Pedido guardado exitosamente' });

  } catch (error) {
    console.error('Error procesando el pedido:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudo guardar el pedido.' });
  }
});

app.listen(port, () => {
  console.log(`🍕 Backend listo en puerto ${port}`);
});