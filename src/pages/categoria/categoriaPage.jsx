import React, { useEffect, useState } from "react";
import CategoriaList from "./categoriaList.jsx";
import CategoriaForm from "./categoriaForm.jsx";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../api/categoriaApi.jsx";
import Sidebar from "../../components/sidebar.jsx";

const CategoriaPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadCategorias() {
    setLoading(true);
    try {
      const data = await getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar categorías:", e);
      alert("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      await deleteCategoria(id);
      alert("Categoría eliminada correctamente");
      loadCategorias();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("Error al eliminar categoría. Puede estar asociada a productos.");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editing) {
        await updateCategoria(editing.id, formData);
        alert("Categoría actualizada correctamente");
      } else {
        await createCategoria(formData);
        alert("Categoría creada correctamente");
      }
      setShowForm(false);
      setEditing(null);
      loadCategorias();
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
          <h1 className="text-3xl font-bold text-gray-800">Categorías de Productos</h1>
        </header>
        <div className="p-6">
          <CategoriaList
            categorias={categorias}
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
                <CategoriaForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  initialData={editing}
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

export default CategoriaPage;
