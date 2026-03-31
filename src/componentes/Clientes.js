import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import "../App.css";

const CHART_COLORS = ["#007bff", "#6610f2", "#6f42c1", "#e83e8c", "#fd7e14", "#20c997"];
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Clientes() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DE FILTROS
  const [searchTipo, setSearchTipo] = useState("All");
  const [searchMes, setSearchMes] = useState("All");
  const [searchClientId, setSearchClientId] = useState("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    const obtenerDatos = async () => {
      try {
        const res = await fetch(`http://localhost:3002/records`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        setData(Array.isArray(result) ? result : (result.data || []));
        setLoading(false);
      } catch (error) { 
        console.error("Error al obtener datos:", error); 
        setLoading(false);
      }
    };
    obtenerDatos();
  }, [token, navigate]);

  // LÓGICA DE FILTRADO TRIPLE
  const filteredData = useMemo(() => {
    return data.filter(d => {
      const matchTipo = searchTipo === "All" || d.type === searchTipo;
      const nombreMes = new Date(d.date).toLocaleString('es-ES', { month: 'long' }).toLowerCase();
      const matchMes = searchMes === "All" || nombreMes.includes(searchMes.toLowerCase());
      const matchClientId = searchClientId === "All" || String(d.client_id) === searchClientId;
      return matchTipo && matchMes && matchClientId;
    });
  }, [data, searchTipo, searchMes, searchClientId]);

  // Listas dinámicas para Selects
  const listaMeses = useMemo(() => [...new Set(data.map(d => new Date(d.date).toLocaleString('es-ES', { month: 'long' })))], [data]);
  const listaClients = useMemo(() => [...new Set(data.map(d => String(d.client_id)))].filter(id => id !== "undefined"), [data]);

  // KPIs DINÁMICOS
  const totalAmount = useMemo(() => {
    const total = filteredData.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    return (total / 1000000).toFixed(2);
  }, [filteredData]);
  
  const totalQty = useMemo(() => (filteredData.length / 1000).toFixed(1), [filteredData]);

  // --- CONFIGURACIÓN DE GRÁFICA TENDENCIA (CON ESCALA CORREGIDA) ---
  const amountPerMonthData = useMemo(() => {
    const mesesEstaticos = ["agosto", "septiembre", "octubre", "noviembre"];
    const tipos = [...new Set(data.map(d => d.type))];
    
    return {
      labels: mesesEstaticos,
      datasets: tipos.map((tipo, index) => ({
        label: tipo,
        data: mesesEstaticos.map(m => data
          .filter(d => d.type === tipo && new Date(d.date).toLocaleString('es-ES', { month: 'long' }).toLowerCase().includes(m))
          .reduce((sum, d) => sum + (Number(d.amount) / 1000000), 0)
        ),
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
      }))
    };
  }, [data]);

  const pieData = useMemo(() => {
    const tipos = [...new Set(filteredData.map(d => d.type))];
    return {
      labels: tipos,
      datasets: [{ 
        data: tipos.map(t => filteredData.filter(d => d.type === t).reduce((sum, d) => sum + Number(d.amount), 0)),
        backgroundColor: CHART_COLORS,
        borderWidth: 0 
      }]
    };
  }, [filteredData]);

  const qtyData = useMemo(() => {
    const tipos = [...new Set(filteredData.map(d => d.type))];
    return {
      labels: tipos,
      datasets: [{ 
        label: 'Cantidad', 
        data: tipos.map(t => filteredData.filter(d => d.type === t).length), 
        backgroundColor: "#007bff",
        borderRadius: 5
      }]
    };
  }, [filteredData]);

  // OPCIONES DE GRÁFICA CON ESCALA AUTOMÁTICA
  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#333', font: { weight: 'bold' } } }
    },
    scales: {
      x: { stacked: true, ticks: { color: '#333' }, grid: { display: false } },
      y: { 
        stacked: true, 
        beginAtZero: true, 
        ticks: { 
          color: '#333',
          callback: (value) => value + 'M' 
        },
        grid: { color: 'rgba(0,0,0,0.05)' }
      }
    }
  };

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

  if (loading) return <div className="loading">Actualizando métricas...</div>;

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
        <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="btn-secondary-osnet" style={{ height: '50px', marginLeft: 'auto' }}>
          Cerrar Sesión
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-box">
          <span>PAYMENT TYPE</span>
          <select value={searchTipo} onChange={(e) => setSearchTipo(e.target.value)}>
            <option value="All">All Types</option>
            {[...new Set(data.map(d => d.type))].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-box">
          <span>DATE</span>
          <select value={searchMes} onChange={(e) => setSearchMes(e.target.value)}>
            <option value="All">All Months</option>
            {listaMeses.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
          </select>
        </div>
        <div className="filter-box">
          <span>CLIENT ID</span>
          <select value={searchClientId} onChange={(e) => setSearchClientId(e.target.value)}>
            <option value="All">All Clients</option>
            {listaClients.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
        </div>
      </div>

      <div className="chart-section full-width">
        <div className="chart-header">$ AMOUNT PER PAYMENT TYPE (MONTHLY TREND)</div>
        <div className="chart-body" style={{ height: '250px' }}>
          <Bar data={amountPerMonthData} options={trendOptions} />
        </div>
      </div>

      <div className="bottom-charts">
        <div className="chart-section half-width">
          <div className="chart-header">$ AMOUNT PER PAYMENT TYPE</div>
          <div className="chart-body"><Pie data={pieData} options={darkTextOptions} /></div>
        </div>
        <div className="chart-section half-width">
          <div className="chart-header">PAYMENT QTY PER PAYMENT TYPE</div>
          <div className="chart-body">
            <Bar data={qtyData} options={{ ...darkTextOptions, indexAxis: 'y', plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clientes;