import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import "../App.css";

// Configuración de colores para las gráficas que contrasten bien en tema oscuro
const CHART_COLORS = ["#00d0dc", "#ff66aa", "#ccddff", "#ffcc66", "#9933FF"];
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Clientes() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  // Filtros (Estilo adaptado en CSS)
  const [searchTipo, setSearchTipo] = useState("All");

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const obtenerDatos = async () => {
      try {
        const res = await fetch(`http://localhost:3002/records`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (error) { console.error("Error:", error); }
    };
    obtenerDatos();
  }, [token, navigate]);

  // KPIs
  const totalAmount = useMemo(() => 
    (data.reduce((sum, d) => sum + Number(d.amount), 0) / 1000000).toFixed(2), [data]);
  
  const totalQty = useMemo(() => (data.length / 1000).toFixed(0), [data]);

  // Gráfica de Barras (Monto por mes)
  const amountPerMonthData = useMemo(() => {
    const meses = ["agosto", "septiembre", "octubre", "noviembre"];
    const tipos = [...new Set(data.map(d => d.type))]; 

    return {
      labels: meses,
      datasets: tipos.map((tipo, index) => ({
        label: tipo,
        data: meses.map(mes => data.filter(d => d.type === tipo && new Date(d.date).toLocaleString('es-ES', { month: 'long' }) === mes).reduce((sum, d) => sum + (Number(d.amount) / 1000000), 0)),
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
      }))
    };
  }, [data]);

  const pieData = useMemo(() => {
    const tipos = [...new Set(data.map(d => d.type))];
    const montos = tipos.map(t => data.filter(d => d.type === t).reduce((sum, d) => sum + Number(d.amount), 0));
    return {
      labels: tipos,
      datasets: [{
        data: montos,
        backgroundColor: CHART_COLORS,
      }]
    };
  }, [data]);

  const qtyData = useMemo(() => {
    const tipos = [...new Set(data.map(d => d.type))];
    return {
      labels: tipos,
      datasets: [{ label: 'Cantidad', data: tipos.map(t => data.filter(d => d.type === t).length), backgroundColor: "#00d0dc" }]
    };
  }, [data]);

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  return (
    <div className="dashboard-container">
      
      {/* KPIs UNIFICADOS */}
      <div className="kpi-row">
        <div className="kpi-card">
          <p>TOTAL $ AMOUNT</p>
          <h1>{totalAmount}M</h1>
        </div>
        <div className="kpi-card">
          <p>PAYMENTS QTY</p>
          <h1>{totalQty}K</h1>
        </div>
        <button onClick={handleLogout} className="btn-osnet btn-secondary-osnet" style={{ height: '50px' }}>Cerrar Sesión</button>
      </div>

      {/* FILTROS UNIFICADOS */}
      <div className="filter-row">
        <div className="filter-box">
          <span>PAYMENT TYPE</span>
          <select value={searchTipo} onChange={(e) => setSearchTipo(e.target.value)}>
            <option value="All">All</option>
            {[...new Set(data.map(d => d.type))].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-box"><span>DATE</span><select disabled><option>All</option></select></div>
      </div>

      {/* GRÁFICA PRINCIPAL */}
      <div className="chart-section full-width">
        <div className="chart-header">$ AMOUNT PER PAYMENT TYPE</div>
        <div className="chart-body" style={{ height: '300px' }}>
          <Bar data={amountPerMonthData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, ticks: {color: '#fff'} }, y: { stacked: true, ticks: {color: '#fff'} } }, plugins: { legend: { labels: { color: '#fff' } } } }} />
        </div>
      </div>

      {/* GRÁFICAS INFERIORES */}
      <div className="bottom-charts">
        <div className="chart-section half-width">
          <div className="chart-header">$ AMOUNT PER PAYMENT TYPE</div>
          <div className="chart-body"><Pie data={pieData} options={{plugins: { legend: { labels: { color: '#fff' } } }}} /></div>
        </div>
        <div className="chart-section half-width">
          <div className="chart-header">PAYMENT QTY PER PAYMENT TYPE</div>
          <div className="chart-body"><Bar data={qtyData} options={{ indexAxis: 'y', scales: { x: { ticks: {color: '#fff'} }, y: { ticks: {color: '#fff'} } }, plugins: { legend: { display: false } } }} /></div>
        </div>
      </div>
    </div>
  );
}

export default Clientes;