import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./componentes/Login";
import QRPage from "./componentes/QRPage";
import Clientes from "./componentes/Clientes";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

  <BrowserRouter>

    <Routes>

      <Route path="/" element={<Login/>}/>
      <Route path="/qr" element={<QRPage/>}/>
      <Route path="/clientes" element={<Clientes/>}/>

    </Routes>

  </BrowserRouter>

);