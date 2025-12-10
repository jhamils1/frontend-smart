import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetalleCarritoList from "./detalleCarritoList.jsx";
import DetalleCarritoForm from "./detalleCarritoForm.jsx";
import {
  getDetallesByCarrito,
  createDetalleCarrito,
  updateDetalleCarrito,
  deleteDetalleCarrito,
} from "../../api/detallecarritoApi.jsx";
import { getProductos } from "../../api/productoApi.jsx";
import Sidebar from "../../components/sidebar.jsx";
import Button from "../../components/button.jsx";

const DetalleCarritoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carrito = location.state?.carrito;

  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Si no hay carrito en el state, redirigir a la página de carritos
  useEffect(() => {
    if (!carrito) {
      alert("No se encontró información del carrito. Redirigiendo...");
      navigate("/carrito");
    }
  }, [carrito, navigate]);

  async function loadDetalles() {
    if (!carrito) return;
    setLoading(true);
    try {
      const data = await getDetallesByCarrito(carrito.id);
      setDetalles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar detalles:", e);
      alert("Error al cargar detalles del carrito");
    } finally {
      setLoading(false);
    }
  }

  async function loadProductos() {
    try {
      const data = await getProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar productos:", e);
      setProductos([]);
    }
  }

  useEffect(() => {
    if (carrito) {
      loadDetalles();
      loadProductos();
    }
  }, [carrito]);

  const handleEdit = (detalle) => {
    setEditing(detalle);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto del carrito?")) return;
    try {
      await deleteDetalleCarrito(id);
      alert("Producto eliminado del carrito correctamente");
      loadDetalles();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("Error al eliminar producto del carrito");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editing) {
        await updateDetalleCarrito(editing.id, formData);
        alert("Detalle del carrito actualizado correctamente");
      } else {
        await createDetalleCarrito(formData);
        alert("Producto agregado al carrito correctamente");
      }
      setShowForm(false);
      setEditing(null);
      loadDetalles();
    } catch (e) {
      console.error("Error:", e);
      const errorMsg = e.response?.data?.error || e.response?.data?.details || e.message;
      alert("Error: " + errorMsg);
    }
  };

  const handleConfirmarPedido = () => {
    if (detalles.length === 0) {
      alert("No puedes confirmar un carrito vacío. Agrega productos primero.");
      return;
    }

    const total = detalles.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0).toFixed(2);
    if (parseFloat(total) <= 0) {
      alert("El total del carrito debe ser mayor a 0.");
      return;
    }

    // Redirigir a la página de pago con la información del carrito
    navigate("/pago", {
      state: {
        carrito: {
          ...carrito,
          total_items: detalles.length,
          total_carrito: total,
        },
      },
    });
  };

  if (!carrito) {
    return null; // El useEffect se encargará de redirigir
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">🛒 Detalle del Carrito</h1>
            <Button variant="cancelar" onClick={() => navigate("/carrito")}>
              ← Volver a Carritos
            </Button>
          </div>
        </header>

        <div className="p-6">
          <DetalleCarritoList
            detalles={detalles}
            carrito={carrito}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={() => {
              setEditing(null);
              setShowForm(true);
            }}
          />

          {/* Botón de confirmar pedido */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                <p className="text-sm mb-1">¿Listo para proceder?</p>
                <p className="text-xs">Confirma el pedido para generar la factura y proceder al pago</p>
              </div>
              <Button variant="guardar" onClick={handleConfirmarPedido}>
                ✓ Confirmar Pedido y Proceder al Pago
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <DetalleCarritoForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  initialData={editing}
                  productos={productos}
                  carritoId={carrito.id}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DetalleCarritoPage;
