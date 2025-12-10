import React, { useEffect, useState } from "react";
import ClienteList from "./clienteList.jsx";
import ClienteForm from "./clienteForm.jsx";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../../api/clientesApi.jsx";
import { getUsuarios } from "../../api/usersApi.jsx";
import Sidebar from "../../components/sidebar.jsx";

const ClientePage = () => {
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadClientes() {
    setLoading(true);
    try {
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar clientes:", e);
      alert("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsuarios() {
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar usuarios:", e);
      setUsuarios([]);
    }
  }

  useEffect(() => {
    loadClientes();
    loadUsuarios();
  }, []);

  const handleEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;
    try {
      await deleteCliente(id);
      alert("Cliente eliminado correctamente");
      loadClientes();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("Error al eliminar cliente");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editing) {
        await updateCliente(editing.id, formData);
        alert("Cliente actualizado correctamente");
      } else {
        await createCliente(formData);
        alert("Cliente creado correctamente");
      }
      setShowForm(false);
      setEditing(null);
      loadClientes();
    } catch (e) {
      console.error("Error:", e);
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        </header>
        <div className="p-6">
          <ClienteList
            clientes={clientes}
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
                <ClienteForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  initialData={editing}
                  usuarios={usuarios}
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

export default ClientePage;
