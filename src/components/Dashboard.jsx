import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { 
    user, 
    logout, 
    getAccessTokenSilently 
  } = useAuth0();

  // Función para procesar el pedido y conectar con el Backend
  const handleOrder = async (pizzaName, price) => {
    try {
      // 1. Obtener Token Seguro (Punto 8)
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://api.pizza42.com",
          scope: "write:orders",
        },
      });

      // 2. Datos del pedido
      const orderData = {
        pizza: pizzaName,
        price: price,
        date: new Date().toISOString(),
        user_email: user.email
      };

      console.log("Enviando orden...", orderData);

      // 3. Llamada al Backend (Punto 5 y 9)
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token en el header
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("✅ ¡Pedido confirmado! Se ha guardado en tu historial.");
        // Opcional: Recargar para ver el historial actualizado si usas window.location.reload()
        // o mejor aún, manejar un estado local.
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || "No se pudo procesar"}`);
      }

    } catch (error) {
      console.error(error);
      alert("Error de autorización o conexión con el servidor.");
    }
  };

  return (
    <>
      {/* --- HEADER (Versión Usuario Logueado) --- */}
      <header className="brand-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/Pizza42_Logo.png" alt="Pizza 42 Logo" />
          </div>

          <div className="auth-buttons">
            <div className="user-controls">
              <span className="greeting">Hola, {user.given_name || user.nickname}</span>
              <button 
                className="btn-hut btn-logout" 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- BANNER --- */}
      <div 
        className="hero-banner" 
        style={{ backgroundImage: "url('/loginbanner_comprimido.png')", height: '450px' }}
      >
      </div>

      {/* --- ÁREA DE PEDIDOS --- */}
      <main className="main-content">
        <div className="dashboard-container">
          
          {/* Banner de Verificación (Punto 7) */}
          {!user.email_verified && (
            <div className="warning-banner">
              ⚠️ <strong>Acción Requerida:</strong> Por favor verifica tu correo ({user.email}) para habilitar los pedidos.
            </div>
          )}

          <h2>Menú Especial Devs</h2>
          
          <div className="menu-grid">
            {/* Pizza 1 */}
            <div className={`menu-card ${!user.email_verified ? 'disabled' : ''}`}>
              <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80" alt="Pizza Pepperoni" />
              <div className="card-body">
                <h3>Pepperoni Auth</h3>
                <p className="price">$180 MXN</p>
                <button 
                  className="btn-order" 
                  onClick={() => handleOrder("Pepperoni Auth", 180)}
                  disabled={!user.email_verified}
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Pizza 2 */}
            <div className={`menu-card ${!user.email_verified ? 'disabled' : ''}`}>
               <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" alt="Pizza Veggie" />
              <div className="card-body">
                <h3>Full Stack Veggie</h3>
                <p className="price">$210 MXN</p>
                <button 
                  className="btn-order" 
                  onClick={() => handleOrder("Full Stack Veggie", 210)}
                  disabled={!user.email_verified}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* HISTORIAL (Punto 10) */}
          <div className="history-section">
              <h3>📜 Tu Historial </h3>
              {/* Leemos el claim personalizado que inyecta la Action */}
              {user['https://pizza42.com/order_history'] && user['https://pizza42.com/order_history'].length > 0 ? (
                <ul className="history-list">
                  {user['https://pizza42.com/order_history'].map((order, index) => (
                    <li key={index} className="history-item">
                      <strong>{order.pizza}</strong> - {new Date(order.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-history">No se encontraron pedidos en tu sesión actual.</p>
              )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;