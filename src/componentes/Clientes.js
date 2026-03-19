import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";
import "../App.css";

function Clientes() {

  const navigate = useNavigate();

  // 🔎 FILTROS
  const [searchId, setSearchId] = useState("");
  const [searchCliente, setSearchCliente] = useState("");
  const [searchTipo, setSearchTipo] = useState("");
  const [searchMonto, setSearchMonto] = useState("");
  const [searchFecha, setSearchFecha] = useState("");
  const [searchAgente, setSearchAgente] = useState("");

  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  // 🚀 FETCH
  useEffect(() => {

    if (!token) {
      alert("Debes iniciar sesión");
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

        const url = `http://localhost:3000/records?${params.toString()}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          throw new Error("No autorizado");
        }

        const result = await res.json();

        if (Array.isArray(result)) {
          setData(result);
        } else if (Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setData([]);
        }

      } catch (error) {
        console.error("ERROR:", error);
      }
    };

    obtenerDatos();

  }, [searchId, searchCliente, searchTipo, searchMonto, searchFecha, searchAgente, token, navigate]);

  // 📊 COLUMNAS
  const columns = useMemo(() => [
    { header: "Id", accessorKey: "id" },
    { header: "Cliente", accessorKey: "client" },
    { header: "Tipo", accessorKey: "type" },
    { header: "Monto", accessorKey: "amount" },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: info => new Date(info.getValue()).toLocaleDateString()
    },
    { header: "Agente", accessorKey: "agent" }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="containerTable">
      <div className="container2">

        <h2>Tabla Clientes</h2>

        {/* 📊 TABLA COMPLETA */}
        <table className="table">
          <thead>

            {/* 🔥 FILA DE FILTROS */}
            <tr className="filter-row">
              <th>
                <input value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="ID" />
              </th>
              <th>
                <input value={searchCliente} onChange={(e) => setSearchCliente(e.target.value)} placeholder="Cliente" />
              </th>
              <th>
                <input value={searchTipo} onChange={(e) => setSearchTipo(e.target.value)} placeholder="Tipo" />
              </th>
              <th>
                <input value={searchMonto} onChange={(e) => setSearchMonto(e.target.value)} placeholder="Monto mínimo" />
              </th>
              <th>
                <input value={searchFecha} onChange={(e) => setSearchFecha(e.target.value)} placeholder="Fecha" />
              </th>
              <th>
                <input value={searchAgente} onChange={(e) => setSearchAgente(e.target.value)} placeholder="Agente" />
              </th>
            </tr>

            {/* 🔹 HEADERS */}
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer" }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}

          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay datos</td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Clientes;