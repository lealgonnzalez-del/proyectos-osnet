import { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import "./Usuario.css";

function SimpleTable() {

  const [search, setSearch] = useState("");

  const data = useMemo(() => [
    { id: 1, cliente: "Juan", tipo: "Pago", monto: 200, fecha: "2026-03-10", agente: "Carlos" },
    { id: 2, cliente: "Maria", tipo: "Retiro", monto: 150, fecha: "2026-03-11", agente: "Ana" },
    { id: 3, cliente: "Pedro", tipo: "Deposito", monto: 300, fecha: "2026-03-12", agente: "Luis" }
      
  ], []);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.id.toString().includes(search)
    );
  }, [search, data]);

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
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className = "containerTable" style={{ 
      width: "100%", 
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba (0, 0, 0, 0.2)"

      }}>

      {/* TITULO */}
      <h2 style={{ textAlign: "center" }}>Tabla de Usuarios</h2>

      {/* BUSCADOR */}
      <div style={{ marginBottom: "15px" }}>
        🔍
        <input
          type="text"
          placeholder="Buscar por ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginLeft: "5px", padding: "5px" }}
        />
      </div>

      {/* TABLA */}
      <table className="table"
        style={{
          width: "100%",
          padding: "20px",
          backgroundColor: "white",
          borderCollapse: "collapse",
          fontSize: "18px"
        }}
      >

        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    padding: "12px",
                    border: "1px solid black",
                    background: "#e6e6e6"
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{
                    padding: "12px",
                    border: "1px solid black",
                    textAlign: "center"
                  }}
                >
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
  );
}

export default SimpleTable;