import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import CuentasAhorro from "./pages/CuentasAhorro";
import Movimientos from "./pages/Movimientos";
import Aportaciones from "./pages/Aportaciones";
import Creditos from "./pages/Creditos";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/cuentas-ahorro" element={<CuentasAhorro />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/aportaciones" element={<Aportaciones />} />
          <Route path="/creditos" element={<Creditos />} />
          <Route
            path="/configuracion"
            element={
              <div className="text-center py-12">
                <h2>Configuración - Próximamente</h2>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
