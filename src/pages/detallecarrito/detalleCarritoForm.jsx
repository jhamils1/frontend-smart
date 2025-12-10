import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
  producto: "",
  cantidad: 1,
  precio_unitario: "0.00",
};

const DetalleCarritoForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  productos = [], 
  carritoId,
  loading 
}) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        producto: initialData.producto || "",
        cantidad: initialData.cantidad || 1,
        precio_unitario: initialData.precio_unitario || "0.00",
      });
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  const handleProductoChange = (productoId) => {
    const producto = productos.find((p) => p.id === parseInt(productoId));
    if (producto) {
      const precioUnitario = parseFloat(producto.precio_venta || producto.precio || 0);
      setForm({
        ...form,
        producto: productoId,
        precio_unitario: precioUnitario.toFixed(2),
      });
    } else {
      setForm({ ...form, producto: productoId });
    }
  };

  const handleCantidadChange = (cantidad) => {
    const cant = parseInt(cantidad) || 1;
    setForm({ ...form, cantidad: cant });
  };

  const calcularSubtotal = () => {
    return (form.cantidad * parseFloat(form.precio_unitario || 0)).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      carrito: carritoId,
      producto: form.producto,
      cantidad: form.cantidad,
    };
    onSubmit(payload);
  };

  return (
    <form className="bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
        {initialData && initialData.id ? "Editar Producto del Carrito" : "Agregar Producto al Carrito"}
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Producto *
          </label>
          <select
            value={form.producto}
            onChange={(e) => handleProductoChange(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.nombre} - Bs. {parseFloat(p.precio_venta || p.precio || 0).toFixed(2)} (Stock: {p.stock || 0})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Cantidad *
          </label>
          <input
            type="number"
            value={form.cantidad}
            onChange={(e) => handleCantidadChange(e.target.value)}
            min="1"
            required
            placeholder="Ingrese la cantidad"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Precio Unitario
            </label>
            <input
              type="text"
              value={`Bs. ${form.precio_unitario}`}
              readOnly
              className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se asigna automáticamente del producto
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Subtotal
            </label>
            <input
              type="text"
              value={`Bs. ${calcularSubtotal()}`}
              readOnly
              className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 font-semibold text-indigo-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Calculado automáticamente
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Nota:</strong> El precio se toma automáticamente del producto seleccionado. Asegúrate de que haya stock suficiente antes de agregar.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
        {onCancel && (
          <Button variant="cancelar" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button variant="guardar" type="submit" disabled={loading}>
          {initialData && initialData.id ? "Actualizar Producto" : "Agregar Producto"}
        </Button>
      </div>
    </form>
  );
};

export default DetalleCarritoForm;
