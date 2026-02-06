import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();

  const signup = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });

  return (
    <>
      {/* --- HEADER (Versión Pública) --- */}
      <header className="brand-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/Pizza42_Logo.png" alt="Pizza 42 Logo" />
          </div>

          <div className="auth-buttons">
            <div className="guest-controls">
              <button className="btn-hut btn-login" onClick={() => loginWithRedirect()}>
                Iniciar Sesión
              </button>
              <span className="divider">|</span>
              <button className="btn-hut btn-signup" onClick={signup}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- BANNER GIGANTE --- */}
      <div 
        className="hero-banner" 
        style={{ backgroundImage: "url('/banner_pizza42_comprimido.png')" }}
      >
      </div>

      {/* --- CONTENIDO MARKETING --- */}
      <main className="main-content">
         <div style={{textAlign: 'center', padding: '50px'}}>
            <h2>¿Por qué Pizza 42?</h2>
            <p>Usamos ingredientes encriptados de extremo a extremo y masa de alta disponibilidad.</p>
         </div>
      </main>
    </>
  );
};

export default LandingPage;