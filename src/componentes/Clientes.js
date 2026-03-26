import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "../App.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

function Clientes() {
  const navigate = useNavigate();

  // 🔎 ESTADOS PARA FILTROS
  const [searchId, setSearchId] = useState("");
  const [searchCliente, setSearchCliente] = useState("");
  const [searchTipo, setSearchTipo] = useState("");
  const [searchMonto, setSearchMonto] = useState("");
  const [searchFecha, setSearchFecha] = useState("");
  const [searchAgente, setSearchAgente] = useState("");

  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  // 🚀 FETCH DE DATOS
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const obtenerDatos = async () => {
      try {
        const params = new URLSearchParams();
        if (searchId) params.append("client_id", searchId);
        if (searchCliente) params.append("client", searchCliente);
        if (searchTipo) params.append("type", searchTipo);
        if (searchMonto) params.append("amount_min", searchMonto);
        if (searchFecha) params.append("date_from", searchFecha);
        if (searchAgente) params.append("agent", searchAgente);

        const url = `http://localhost:3002/records?${params.toString()}`;

        const res = await fetch(url, {
          headers: {
            // El backend debe usar este Token para filtrar registros del usuario logueado
            Authorization: `Bearer ${token}` 
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const result = await res.json();
        setData(Array.isArray(result) ? result : result.data || []);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    obtenerDatos();
  }, [searchId, searchCliente, searchTipo, searchMonto, searchFecha, searchAgente, token, navigate]);

  // 📊 LÓGICA DE DATOS PARA GRÁFICOS (Memoizada para rendimiento)
  const tipoData = useMemo(() => ({
    labels: ["Pago", "Cobro"],
    datasets: [{
      label: "Total $",
      data: [
        data.filter(d => d.type?.toLowerCase() === "pago").reduce((sum, d) => sum + Number(d.amount), 0),
        data.filter(d => d.type?.toLowerCase() === "cobro").reduce((sum, d) => sum + Number(d.amount), 0)
      ],
      backgroundColor: ["#4CAF50", "#F44336"]
    }]
  }), [data]);

  const clienteData = useMemo(() => {
    const clientesUnicos = [...new Set(data.map(d => d.client))];
    return {
      labels: clientesUnicos,
      datasets: [{
        label: "Monto por Cliente",
        data: clientesUnicos.map(c =>
          data.filter(d => d.client === c).reduce((sum, d) => sum + Number(d.amount), 0)
        ),
        backgroundColor: "#2196F3"
      }]
    };
  }, [data]);

  const fechaData = useMemo(() => {
    const fechas = [...new Set(data.map(d => d.date))].sort();
    return {
      labels: fechas.map(f => new Date(f).toLocaleDateString()),
      datasets: [
        {
          label: "Pagos",
          data: fechas.map(f =>
            data.filter(d => d.date === f && d.type === "pago").reduce((sum, d) => sum + Number(d.amount), 0)
          ),
          borderColor: "#4CAF50",
          tension: 0.3
        },
        {
          label: "Cobros",
          data: fechas.map(f =>
            data.filter(d => d.date === f && d.type === "cobro").reduce((sum, d) => sum + Number(d.amount), 0)
          ),
          borderColor: "#F44336",
          tension: 0.3
        }
      ]
    };
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="containerTable">
      <div className="container2">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="title">Panel Visual de Registros</h2>
          <button onClick={handleLogout} className="clearButton" style={{ height: '40px' }}>Cerrar Sesión</button>
        </div>

        {/* 🔍 SECCIÓN DE FILTROS */}
        <div className="filtros-container">
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Filtrar Gráficas:</p>
          <div className="searchBox">
            <input value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="ID Cliente" />
            <input value={searchCliente} onChange={(e) => setSearchCliente(e.target.value)} placeholder="Nombre Cliente" />
            <input value={searchTipo} onChange={(e) => setSearchTipo(e.target.value)} placeholder="Tipo (pago/cobro)" />
            <input value={searchMonto} onChange={(e) => setSearchMonto(e.target.value)} placeholder="Monto Min" />
            <input value={searchFecha} onChange={(e) => setSearchFecha(e.target.value)} type="date" />
            <input value={searchAgente} onChange={(e) => setSearchAgente(e.target.value)} placeholder="ID Agente" />
          </div>
        </div>

        <hr style={{ margin: '30px 0', border: '0.5px solid #eee' }} />

        {/* 📊 CONTENEDOR DE GRÁFICAS (Grid) */}
        {data.length > 0 ? (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Distribución de Transacciones</h3>
              <div style={{ maxWidth: '300px', margin: 'auto' }}>
                <Pie data={tipoData} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Montos Acumulados por Cliente</h3>
              <Bar data={clienteData} options={{ indexAxis: 'y', responsive: true }} />
            </div>

            <div className="chart-card full-width">
              <h3>Tendencia de Movimientos</h3>
              <Line data={fechaData} options={{ responsive: true }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>No se encontraron datos para los filtros seleccionados.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Clientes;