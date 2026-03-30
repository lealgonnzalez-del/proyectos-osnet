import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import "../App.css";

// Colores vibrantes estilo Dashboard moderno
const CHART_COLORS = ["#007bff", "#6610f2", "#6f42c1", "#e83e8c", "#fd7e14", "#20c997"];
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Clientes() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
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

  // Configuración base para que los textos de las gráficas sean OSCUROS
  const darkTextOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#333', font: { weight: 'bold' } } }
    },
    scales: {
      x: { ticks: { color: '#333' }, grid: { display: false } },
      y: { ticks: { color: '#333' } }
    }
  };

  const totalAmount = useMemo(() => 
    (data.reduce((sum, d) => sum + Number(d.amount), 0) / 1000000).toFixed(2), [data]);
  
  const totalQty = useMemo(() => (data.length / 1000).toFixed(0), [data]);

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
      datasets: [{ data: montos, backgroundColor: CHART_COLORS }]
    };
  }, [data]);

  const qtyData = useMemo(() => {
    const tipos = [...new Set(data.map(d => d.type))];
    return {
      labels: tipos,
      datasets: [{ label: 'Cantidad', data: tipos.map(t => data.filter(d => d.type === t).length), backgroundColor: "#007bff" }]
    };
  }, [data]);

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  return (
    <div className="dashboard-container">
      <div className="kpi-row">
        <div className="kpi-card">
          <p>TOTAL $ AMOUNT</p>
          <h1>{totalAmount}M</h1>
        </div>
        <div className="kpi-card">
          <p>PAYMENTS QTY</p>
          <h1>{totalQty}K</h1>
        </div>
        <button onClick={handleLogout} className="btn-secondary-osnet" style={{ height: '50px', marginLeft: 'auto' }}>Cerrar Sesión</button>
      </div>

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

      <div className="chart-section full-width">
        <div className="chart-header">$ AMOUNT PER PAYMENT TYPE</div>
        <div className="chart-body" style={{ height: '250px' }}>
          <Bar data={amountPerMonthData} options={{...darkTextOptions, scales: { x: { stacked: true, ticks: {color: '#333'} }, y: { stacked: true, ticks: {color: '#333'} } }}} />
        </div>
      </div>

      <div className="bottom-charts">
        <div className="chart-section half-width">
          <div className="chart-header">$ AMOUNT PER PAYMENT TYPE</div>
          <div className="chart-body"><Pie data={pieData} options={darkTextOptions} /></div>
        </div>
        <div className="chart-section half-width">
          <div className="chart-header">PAYMENT QTY PER PAYMENT TYPE</div>
          <div className="chart-body"><Bar data={qtyData} options={{ ...darkTextOptions, indexAxis: 'y', plugins: { legend: { display: false } } }} /></div>
        </div>
      </div>
    </div>
  );
}

export default Clientes;