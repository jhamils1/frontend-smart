import React, { useMemo, useState } from "react";
import Button from "../../components/button.jsx";

const DetalleCarritoList = ({ 
  detalles, 
  onEdit, 
  onDelete, 
  onAddNew,
  carrito 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!detalles || !Array.isArray(detalles)) return [];
    if (!searchTerm) return detalles;
    const s = searchTerm.toLowerCase();
    return detalles.filter((d) => {
      return (
        (d.producto_nombre && d.producto_nombre.toLowerCase().includes(s)) ||
        (d.producto_codigo && d.producto_codigo.toLowerCase().includes(s)) ||
        (d.id && String(d.id).includes(s))
      );
    });
  }, [searchTerm, detalles]);

  const calcularTotalItems = () => {
    return filtered.reduce((sum, d) => sum + (d.cantidad || 0), 0);
  };

  const calcularTotalCarrito = () => {
    return filtered.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0).toFixed(2);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Información del Carrito */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Detalle del Carrito #{carrito?.id}
        </h2>
        <div className="flex gap-4 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Código:</span> {carrito?.codigo || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Cliente:</span> {carrito?.cliente_nombre || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Estado:</span> 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              carrito?.estado === 'activo' ? 'bg-blue-100 text-blue-800' :
              carrito?.estado === 'completado' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {carrito?.estado || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Botones de acción y búsqueda */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="guardar" onClick={onAddNew}>
          + Agregar Producto
        </Button>
        <div className="flex justify-end flex-1 ml-8">
          <input
            type="text"
            placeholder="Buscar por producto, código o ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 w-80 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tabla de detalles */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">ID</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Código</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Producto</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Cantidad</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Precio Unit.</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Subtotal</th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6 text-sm text-gray-900">#{d.id}</td>
                <td className="py-3 px-6 text-sm text-gray-900 font-mono">
                  {d.producto_codigo || "-"}
                </td>
                <td className="py-3 px-6 text-sm text-gray-900">
                  {d.producto_nombre || `Producto #${d.producto}`}
                </td>
                <td className="py-3 px-6 text-sm text-gray-900">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {d.cantidad}
                  </span>
                </td>
                <td className="py-3 px-6 text-sm text-gray-900">
                  Bs. {parseFloat(d.precio_unitario || 0).toFixed(2)}
                </td>
                <td className="py-3 px-6 text-sm text-gray-900 font-semibold">
                  Bs. {parseFloat(d.subtotal || 0).toFixed(2)}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="editar" onClick={() => onEdit(d)}>
                      Editar
                    </Button>
                    <Button variant="eliminar" onClick={() => onDelete(d.id)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje si no hay productos */}
      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          {searchTerm 
            ? "No se encontraron productos que coincidan con la búsqueda" 
            : "No hay productos en este carrito. Haz clic en 'Agregar Producto' para comenzar."}
        </div>
      )}

      {/* Resumen del carrito */}
      <div className="border-t pt-4 mt-4">
        <div className="bg-indigo-50 px-6 py-4 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total de items: <span className="font-semibold text-gray-800">{calcularTotalItems()}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700">
              Total del Carrito: <span className="text-2xl text-indigo-600">Bs. {calcularTotalCarrito()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCarritoList;
