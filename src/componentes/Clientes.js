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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "../App.css";

const CHART_COLORS = ["#6f42c1", "#007bff", "#5a2d81", "#e83e8c", "#20c997", "#fd7e14", "#ffc107", "#28a745"];

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartDataLabels 
);

function Clientes() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTipo, setSearchTipo] = useState("All");
  const [searchFecha, setSearchFecha] = useState("All");

  const token = localStorage.getItem("token");

  const paymentTypes = [
    "pago", "cobro", "tarjeta de credito", "cheque", 
    "paypal", "efectivo", "credito a cuenta", "otro"
  ];

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

  const filteredData = useMemo(() => {
    return data.filter(d => {
      const typeLower = String(d.type || "").toLowerCase();
      const matchTipo = searchTipo === "All" || typeLower === searchTipo.toLowerCase();
      
      const dateObj = new Date(d.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      const matchFecha = searchFecha === "All" || formattedDate === searchFecha;
      
      return matchTipo && matchFecha;
    });
  }, [data, searchTipo, searchFecha]);

  const totalAmount = useMemo(() => {
    const total = filteredData.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    return (total / 1000000).toFixed(2);
  }, [filteredData]);
  
  const totalQty = useMemo(() => (filteredData.length / 1000).toFixed(1), [filteredData]);

  const pieData = useMemo(() => {
    const tiposUnicos = [...new Set(filteredData.map(d => d.type))];
    const mapping = tiposUnicos.map(t => {
      const total = filteredData
        .filter(d => d.type === t)
        .reduce((sum, d) => sum + Number(d.amount), 0);
      return { label: t, value: total };
    });

    mapping.sort((a, b) => b.value - a.value);

    return {
      labels: mapping.map(m => m.label.charAt(0).toUpperCase() + m.label.slice(1)),
      datasets: [{ 
        data: mapping.map(m => m.value),
        backgroundColor: CHART_COLORS,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }, [filteredData]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          color: '#333',
          font: { size: 11, weight: '500' }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        offset: 10,
        color: '#444',
        font: { size: 10, weight: 'bold' },
        clip: false, 
        formatter: (value, ctx) => {
          const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value * 100) / sum).toFixed(2) + "%";
          const formattedValue = (value / 1000).toFixed(2) + "K";
          return `${formattedValue}\n(${percentage})`;
        }
      },
      tooltip: { enabled: true }
    },
    layout: {
      padding: { right: 60, left: 20, top: 40, bottom: 20 }
    }
  };

  const amountPerMonthData = useMemo(() => {
    const mesesEstaticos = ["agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const tiposActivos = [...new Set(filteredData.map(d => d.type))];
    return {
      labels: mesesEstaticos,
      datasets: tiposActivos.map((tipo, index) => ({
        label: tipo,
        data: mesesEstaticos.map(m => filteredData
          .filter(d => d.type === tipo && new Date(d.date).toLocaleString('es-ES', { month: 'long' }).toLowerCase().includes(m))
          .reduce((sum, d) => sum + (Number(d.amount) / 1000000), 0)
        ),
        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
      }))
    };
  }, [filteredData]);

  if (loading) return <div className="loading">Actualizando métricas...</div>;

  return (
    <div className="dashboard-container">
       <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="btn-secondary-osnet" style={{ height: '25px',  marginBottom: '15px', padding: '0 15px' }}>
          Cerrar Sesión
        </button>
      <div className="kpi-row">
        <div className="kpi-card">
          <p>TOTAL $ AMOUNT</p>
          <h1>{totalAmount}M</h1>
        </div>
        <div className="kpi-card">
          <p>PAYMENTS QTY</p>
          <h1>{totalQty}K</h1>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-box">
          <span>PAYMENT TYPE</span>
          <select value={searchTipo} onChange={(e) => setSearchTipo(e.target.value)}>
            <option value="All">All Types</option>
            {paymentTypes.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="filter-box">
          <span>DATE (D/M/Y)</span>
          <input 
            type="date" 
            value={searchFecha === "All" ? "" : searchFecha} 
            onChange={(e) => setSearchFecha(e.target.value || "All")}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
          />
        </div>
      </div>

      <div className="chart-section full-width">
        <div className="chart-header">$ AMOUNT PER PAYMENT TYPE (MONTHLY TREND)</div>
        <div className="chart-body" style={{ height: '250px' }}>
          <Bar 
            data={amountPerMonthData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false, 
              scales: { 
                y: { ticks: { callback: v => v + 'M' } } 
              },
              plugins: {
                datalabels: {
                  display: true,
                  anchor: 'end',
                  align: 'top',
                  color: '#444',
                  font: { weight: 'bold', size: 10 },
                  formatter: (value) => value > 0 ? value.toFixed(2) + 'M' : ''
                }
              }
            }} 
          />
        </div>
      </div>

      <div className="bottom-charts">
        <div className="chart-section half-width">
          <div className="chart-header">$ AMOUNT PER PAYMENT TYPE</div>
          <div className="chart-body" style={{ height: '300px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="chart-section half-width">
          <div className="chart-header">PAYMENT QTY PER PAYMENT TYPE</div>
          <div className="chart-body" style={{ height: '320px' }}>
            <Bar 
              data={{
                labels: pieData.labels,
                datasets: [{ 
                  label: 'Qty', 
                  data: pieData.labels.map(l => filteredData.filter(d => d.type.toLowerCase() === l.toLowerCase()).length), 
                  backgroundColor: '#007bff' 
                }]
              }} 
              options={{ 
                indexAxis: 'y', 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                  datalabels: { 
                    display: true, 
                    anchor: 'end', 
                    align: 'right', 
                    offset: 5,
                    color: '#444',
                    font: { weight: 'bold', size: 11 },
                    formatter: (value) => value // Muestra el número exacto (ej. 32)
                  }, 
                  legend: { display: false } 
                } 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clientes;