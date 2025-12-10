import React, { useEffect, useState } from "react";
import ProductoList from "./productoList.jsx";
import ProductoForm from "./productoForm.jsx";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../../api/productoApi.jsx";
import { getCategorias } from "../../api/categoriaApi.jsx";
import Sidebar from "../../components/sidebar.jsx";

const ProductoPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadProductos() {
    setLoading(true);
    try {
      const data = await getProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar productos:", e);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  async function loadCategorias() {
    try {
      const data = await getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar categorías:", e);
      setCategorias([]);
    }
  }

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  const handleEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProducto(id);
      alert("Producto eliminado correctamente");
      loadProductos();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("Error al eliminar producto. Puede estar asociado a otros registros.");
    }
  };

  const handleFormSubmit = async (formData, imageFile) => {
    try {
      let dataToSend;
      
      // Si hay un archivo de imagen, usar FormData
      if (imageFile) {
        dataToSend = new FormData();
        dataToSend.append('codigo', formData.codigo);
        dataToSend.append('nombre', formData.nombre);
        dataToSend.append('descripcion', formData.descripcion);
        dataToSend.append('precio_compra', parseFloat(formData.precio_compra));
        dataToSend.append('precio_venta', parseFloat(formData.precio_venta));
        dataToSend.append('stock', parseInt(formData.stock));
        dataToSend.append('costo_promedio', parseFloat(formData.precio_compra));
        dataToSend.append('imagen', imageFile);
        
        if (formData.categoria) {
          dataToSend.append('categoria', formData.categoria);
        }
      } else {
        // Si es URL o no hay imagen, usar JSON
        dataToSend = {
          ...formData,
          precio_compra: parseFloat(formData.precio_compra),
          precio_venta: parseFloat(formData.precio_venta),
          stock: parseInt(formData.stock),
          categoria: formData.categoria || null,
          costo_promedio: formData.precio_compra,
        };
      }

      if (editing) {
        await updateProducto(editing.id, dataToSend);
        alert("Producto actualizado correctamente");
      } else {
        await createProducto(dataToSend);
        alert("Producto creado correctamente");
      }
      setShowForm(false);
      setEditing(null);
      loadProductos();
    } catch (e) {
      console.error("Error:", e);
      const errorMsg = e.response?.data?.details || e.response?.data?.error || e.message;
      alert("Error: " + JSON.stringify(errorMsg));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
        </header>
        <div className="p-6">
          <ProductoList
            productos={productos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={() => {
              setEditing(null);
              setShowForm(true);
            }}
          />

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <ProductoForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  initialData={editing}
                  categorias={categorias}
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

export default ProductoPage;
