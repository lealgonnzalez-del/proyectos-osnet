import { useState, useMemo, useEffect } from "react";
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
  const [data, setData] = useState([]);

  // 🔌 CONEXIÓN BACKEND
  useEffect(() => {
    fetch("http://localhost:3000/records")
      .then(res => res.json())
      .then(result => {
        console.log("DATOS BACKEND:", result);

        // 🔥 VALIDACIÓN IMPORTANTE
        if (Array.isArray(result)) {
          setData(result);
        } else if (Array.isArray(result.data)) {
          setData(result.data); // por si viene { data: [...] }
        } else {
          console.error("❌ No es un array:", result);
          setData([]);
        }
      })
      .catch(err => console.error("ERROR FETCH:", err));
  }, []);

  // 🔎 FILTROS SEGUROS
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      (item.id?.toString() || "").includes(searchId) &&
      (item.cliente?.toLowerCase() || "").includes(searchCliente.toLowerCase()) &&
      (item.tipo?.toLowerCase() || "").includes(searchTipo.toLowerCase()) &&
      (item.monto?.toString() || "").includes(searchMonto) &&
      (item.fecha || "").includes(searchFecha) &&
      (item.agente?.toLowerCase() || "").includes(searchAgente.toLowerCase())
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="containerTable">

      <div className="container2">

        <h2>Tabla Clientes</h2>

        {/* 🔎 BUSCADORES */}
        <div className="searchBox">

          <input
            placeholder="ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />

          <input
            placeholder="Cliente"
            value={searchCliente}
            onChange={(e) => setSearchCliente(e.target.value)}
          />

          <input
            placeholder="Tipo"
            value={searchTipo}
            onChange={(e) => setSearchTipo(e.target.value)}
          />

          <input
            placeholder="Monto"
            value={searchMonto}
            onChange={(e) => setSearchMonto(e.target.value)}
          />

          <input
            placeholder="Fecha"
            value={searchFecha}
            onChange={(e) => setSearchFecha(e.target.value)}
          />

          <input
            placeholder="Agente"
            value={searchAgente}
            onChange={(e) => setSearchAgente(e.target.value)}
          />

        </div>

        {/* 📊 TABLA */}
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
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