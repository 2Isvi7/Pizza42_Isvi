import 'dotenv/config'; // Reemplaza a require('dotenv').config()
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { auth } from 'express-oauth2-jwt-bearer';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE SEGURIDAD (Valida el token que viene de React)
const checkJwt = auth({
  audience: 'https://api.pizza42.com',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

// 2. FUNCIÓN PARA OBTENER EL TOKEN DE "EMPLEADO" (Machine to Machine)
const getManagementToken = async () => {
  try {
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
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

// 3. LA RUTA DE PEDIDOS
app.post('/api/orders', checkJwt, async (req, res) => {
  try {
    const newOrder = req.body;
    const userId = req.auth.payload.sub; // ID del usuario

    console.log(`Recibiendo pedido para: ${userId}`);

    // A. Obtenemos el permiso para escribir en Auth0
    const managementToken = await getManagementToken();

    // B. Primero leemos el historial actual
    const userUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`;
    const userResponse = await axios.get(userUrl, {
      headers: { Authorization: `Bearer ${managementToken}` }
    });
    
    const currentOrders = userResponse.data.user_metadata?.orders || [];
    
    // C. Agregamos el nuevo pedido
    currentOrders.push(newOrder);

    // D. Guardamos la lista actualizada
    await axios.patch(userUrl, 
      { user_metadata: { orders: currentOrders } },
      { headers: { Authorization: `Bearer ${managementToken}` } }
    );

    res.status(200).json({ message: 'Pedido guardado exitosamente' });

  } catch (error) {
    console.error('Error en el servidor:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudo guardar el pedido' });
  }
});

// Arrancar el servidor
app.listen(3001, () => {
  console.log('🍕 Backend de Pizza 42 listo en http://localhost:3001');
});