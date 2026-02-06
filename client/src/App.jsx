import { useAuth0 } from "@auth0/auth0-react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) return <div className="loading">Cargando horno...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="app-container">
      {isAuthenticated ? <Dashboard /> : <LandingPage />}
    </div>
  );
}

export default App;