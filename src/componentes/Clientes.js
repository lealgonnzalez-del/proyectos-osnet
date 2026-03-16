import { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import "../App.css";

function Clientes() {

  const [searchId, setSearchId] = useState("");
  const [searchCliente, setSearchCliente] = useState("");
  const [searchTipo, setSearchTipo] = useState("");
  const [searchMonto, setSearchMonto] = useState("");
  const [searchFecha, setSearchFecha] = useState("");
  const [searchAgente, setSearchAgente] = useState("");
  const [sorting, setSorting] = useState([]);

  const data = useMemo(() => [
    { id: 1, cliente: "Juan", tipo: "Pago", monto: 200, fecha: "2026-03-10", agente: "Carlos" },
    { id: 2, cliente: "Maria", tipo: "Retiro", monto: 150, fecha: "2026-03-11", agente: "Ana" },
    { id: 3, cliente: "Pedro", tipo: "Deposito", monto: 300, fecha: "2026-03-12", agente: "Luis" },
    { id: 4, cliente: "Luis", tipo: "Pago", monto: 250, fecha: "2026-03-13", agente: "Carlos" },
    { id: 5, cliente: "Sofia", tipo: "Retiro", monto: 180, fecha: "2026-03-14", agente: "Ana" },
    { id: 6, cliente: "Andres", tipo: "Deposito", monto: 400, fecha: "2026-03-15", agente: "Luis" },
    { id: 7, cliente: "Camila", tipo: "Pago", monto: 220, fecha: "2026-03-16", agente: "Carlos" },
    { id: 8, cliente: "Diego", tipo: "Retiro", monto: 130, fecha: "2026-03-17", agente: "Ana" },
    { id: 9, cliente: "Valentina", tipo: "Deposito", monto: 500, fecha: "2026-03-18", agente: "Luis" },
    { id: 10, cliente: "Jorge", tipo: "Pago", monto: 275, fecha: "2026-03-19", agente: "Carlos" },
    { id: 11, cliente: "Laura", tipo: "Retiro", monto: 160, fecha: "2026-03-20", agente: "Ana" }
  ], []);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.id.toString().includes(searchId) &&
      item.cliente.toLowerCase().includes(searchCliente.toLowerCase()) &&
      item.tipo.toLowerCase().includes(searchTipo.toLowerCase()) &&
      item.monto.toString().includes(searchMonto) &&
      item.fecha.includes(searchFecha) &&
      item.agente.toLowerCase().includes(searchAgente.toLowerCase())
    );
  }, [searchId, searchCliente, searchTipo, searchMonto, searchFecha, searchAgente, data]);

  const columns = useMemo(() => [
    { header: "Id", accessorKey: "id" },
    { header: "Cliente", accessorKey: "cliente" },
    { header: "Tipo", accessorKey: "tipo" },
    { header: "Monto", accessorKey: "monto" },
    { header: "Fecha", accessorKey: "fecha" },
    { header: "Agente", accessorKey: "agente" }
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="containerTable">

      <div className="container2">

        <h2>Tabla Clientes</h2>

        {/* BUSCADORES */}
        <div className="searchBox">

          🔍

          <input
            placeholder="Buscar ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <input
            placeholder="Buscar Cliente"
            value={searchCliente}
            onChange={(e) => setSearchCliente(e.target.value)}
          />

          <input
            placeholder="Buscar Tipo"
            value={searchTipo}
            onChange={(e) => setSearchTipo(e.target.value)}
          />

          <input
            placeholder="Buscar Monto"
            value={searchMonto}
            onChange={(e) => setSearchMonto(e.target.value)}
          />

          <input
            placeholder="Buscar Fecha"
            value={searchFecha}
            onChange={(e) => setSearchFecha(e.target.value)}
          />

          <input
            placeholder="Buscar Agente"
            value={searchAgente}
            onChange={(e) => setSearchAgente(e.target.value)}
          />

        </div>

        {/* TABLA */}
        <table className="table">

          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>

                {headerGroup.headers.map(header => (

                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer" }}
                  >

                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {{
                      asc: " 🔼",
                      desc: " 🔽"
                    }[header.column.getIsSorted()] ?? null}

                  </th>

                ))}

              </tr>
            ))}
          </thead>

          <tbody>

            {table.getRowModel().rows.map(row => (

              <tr key={row.id}>

                {row.getVisibleCells().map(cell => (

                  <td key={cell.id}>

                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Clientes;