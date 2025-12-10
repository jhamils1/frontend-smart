import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CarritoList from "./carritoList.jsx";
import CarritoForm from "./carritoForm.jsx";
import {
  getCarritos,
  createCarrito,
  updateCarrito,
  deleteCarrito,
} from "../../api/carritoApi.jsx";
import { getClientes } from "../../api/clientesApi.jsx";
import Sidebar from "../../components/sidebar.jsx";

const CarritoPage = () => {
  const location = useLocation();
  const [carritos, setCarritos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  async function loadCarritos() {
    setLoading(true);
    try {
      const data = await getCarritos();
      setCarritos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar carritos:", e);
      alert("Error al cargar carritos");
    } finally {
      setLoading(false);
    }
  }

  async function loadClientes() {
    try {
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar clientes:", e);
      setClientes([]);
    }
  }

  useEffect(() => {
    loadCarritos();
    loadClientes();

    // Mostrar mensaje de éxito si viene del pago
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [location]);

  const handleEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este carrito?")) return;
    try {
      await deleteCarrito(id);
      alert("Carrito eliminado correctamente");
      loadCarritos();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("Error al eliminar carrito");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editing) {
        await updateCarrito(editing.id, formData);
        alert("Carrito actualizado correctamente");
      } else {
        await createCarrito(formData);
        alert("Carrito creado correctamente");
      }
      setShowForm(false);
      setEditing(null);
      loadCarritos();
    } catch (e) {
      console.error("Error:", e);
      alert("Error: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">🛒 Carrito de Compra</h1>
        </header>

        {/* Mensaje de éxito del pago */}
        {successMessage && (
          <div className="mx-6 mt-6">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-green-800">
                    {successMessage}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="ml-auto flex-shrink-0 text-green-500 hover:text-green-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <CarritoList
            carritos={carritos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={() => {
              setEditing(null);
              setShowForm(true);
            }}
          />

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <CarritoForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  initialData={editing}
                  clientes={clientes}
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

export default CarritoPage;
