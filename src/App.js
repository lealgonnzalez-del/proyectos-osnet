import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./componentes/Login";
import Clientes from "./componentes/Clientes";
import MfaPage from "./componentes/mfapage";
import QRPage from "./componentes/QRPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/mfa" element={<MfaPage />} />
        <Route path="/qr" element={<QRPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;