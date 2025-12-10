import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos } from "../../api/productoApi";
import { getCategorias } from "../../api/categoriaApi";
import { addDetalleCarrito } from "../../api/detallecarritoApi";
import { getCarritos, createCarrito } from "../../api/carritoApi";
import { getCurrentUser } from "../../api/meApi";
import { useAuth } from "../../hooks/useAuth";

const TiendaPage = () => {
  const navigate = useNavigate();
  const { logout, getUserInfo } = useAuth();
  const { username, userRole } = getUserInfo();
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [carritoActual, setCarritoActual] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Primero obtener info del usuario para obtener el cliente_id
      const userData = await getCurrentUser();
      console.log("Usuario actual:", userData);
      
      // Si el usuario tiene un cliente asociado, obtener su ID
      if (userData.cliente && userData.cliente.id) {
        setClienteId(userData.cliente.id);
      } else {
        showNotification("Usuario sin perfil de cliente asociado", "error");
        setLoading(false);
        return;
      }
      
      const [productosData, categoriasData, carritosData] = await Promise.all([
        getProductos(),
        getCategorias(),
        getCarritos()
      ]);
      
      setProductos(productosData);
      setCategorias(categoriasData);
      
      // Buscar carrito activo o crear uno nuevo
      const carritoActivo = carritosData.find(c => c.estado === 'activo');
      if (carritoActivo) {
        setCarritoActual(carritoActivo);
      } else if (userData.cliente && userData.cliente.id) {
        // Crear un nuevo carrito activo con el ID del cliente
        const nuevoCarrito = await createCarrito({
          cliente: userData.cliente.id,
          estado: 'activo'
        });
        setCarritoActual(nuevoCarrito);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      showNotification("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleAddToCart = async (producto) => {
    if (!carritoActual) {
      showNotification("Error: No hay carrito disponible", "error");
      return;
    }

    if (producto.stock <= 0) {
      showNotification("Producto sin stock disponible", "error");
      return;
    }

    try {
      await addDetalleCarrito({
        carrito: carritoActual.id,
        producto: producto.id,
        cantidad: 1,
        precio_unitario: producto.precio_venta
      });
      
      showNotification(`${producto.nombre} añadido al carrito`, "success");
      
      // Recargar solo el carrito completo con detalles
      const { getCarrito } = await import('../../api/carritoApi');
      const carritoActualizado = await getCarrito(carritoActual.id);
      setCarritoActual(carritoActualizado);
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      showNotification("Error al añadir al carrito", "error");
    }
  };

  const handleLogout = () => {
    logout({ navigate });
  };

  const productosFiltrados = productos.filter((producto) => {
    const matchCategoria = categoriaSeleccionada === "todas" || 
                          producto.categoria === parseInt(categoriaSeleccionada);
    const matchSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategoria && matchSearch;
  });

  const totalItemsCarrito = carritoActual?.detalles?.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y Título */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg font-bold text-xl">
                SMART
              </div>
              <h1 className="text-2xl font-bold text-gray-800">SALES <span className="text-blue-600">360</span></h1>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-xl mx-8">
              <input
                type="text"
                placeholder="Estoy buscando..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Usuario y Carrito */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/cliente/pedidos")}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">Mis Pedidos</span>
              </button>
              
              <button
                onClick={() => navigate("/cliente/carrito")}
                className="relative flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-xl">🛒</span>
                <span className="font-semibold">Carrito</span>
                {totalItemsCarrito > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {totalItemsCarrito}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">Hola, {username}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Cerrar Sesión
                  </button>
                </div>
                <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                  <span className="text-xl">👤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notificaciones */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}>
            <p className="font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <button
              onClick={() => setCategoriaSeleccionada("todas")}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                categoriaSeleccionada === "todas"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📋 Todas las Categorías
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaSeleccionada(categoria.id.toString())}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                  categoriaSeleccionada === categoria.id.toString()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Productos */}
      <main className="container mx-auto px-4 py-8">
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">
              Intenta cambiar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {categoriaSeleccionada === "todas" 
                  ? "Todos los Productos" 
                  : categorias.find(c => c.id.toString() === categoriaSeleccionada)?.nombre}
              </h2>
              <p className="text-gray-600 mt-1">
                {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} disponible{productosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// Componente de tarjeta de producto
const ProductoCard = ({ producto, onAddToCart }) => {
  const stockStatus = producto.stock === 0 
    ? { text: "Agotado", color: "text-red-600" }
    : producto.stock < 10 
    ? { text: `Solo ${producto.stock} disponibles`, color: "text-yellow-600" }
    : { text: "Disponible", color: "text-green-600" };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="relative h-64 bg-gray-100">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x300?text=Sin+Imagen";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">📦</span>
          </div>
        )}
        
        {/* Badge de stock */}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            producto.stock === 0 
              ? "bg-red-100 text-red-800" 
              : producto.stock < 10 
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}>
            Stock: {producto.stock}
          </span>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
          {producto.nombre}
        </h3>
        
        {producto.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
          <span className="text-xs text-gray-500">
            Código: {producto.codigo}
          </span>
        </div>

        {/* Precio y botón */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {parseFloat(producto.precio_venta).toFixed(2)} Bs.
            </p>
          </div>
          <button
            onClick={() => onAddToCart(producto)}
            disabled={producto.stock === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              producto.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {producto.stock === 0 ? "Agotado" : "Añadir"}
          </button>
        </div>

        {/* Información de cuotas (simulada) */}
        {producto.stock > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 flex items-center">
              <span className="mr-1">💳</span>
              en 3 cuotas de <span className="font-semibold ml-1">
                {(parseFloat(producto.precio_venta) / 3).toFixed(2)} Bs
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiendaPage;
