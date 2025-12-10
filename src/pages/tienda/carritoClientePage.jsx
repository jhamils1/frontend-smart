import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCarritos } from "../../api/carritoApi";
import { 
  updateDetalleCarrito, 
  deleteDetalleCarrito 
} from "../../api/detallecarritoApi";
import { useAuth } from "../../hooks/useAuth";

const CarritoClientePage = () => {
  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const { username } = getUserInfo();
  
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const carritos = await getCarritos();
      const carritoActivo = carritos.find(c => c.estado === 'activo');
      
      if (carritoActivo && carritoActivo.id) {
        // Obtener el carrito completo con detalles usando getCarrito(id)
        const { getCarrito } = await import('../../api/carritoApi');
        const carritoCompleto = await getCarrito(carritoActivo.id);
        console.log("Carrito completo con detalles:", carritoCompleto);
        setCarrito(carritoCompleto);
      } else {
        setCarrito(null);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      showNotification("Error al cargar el carrito", "error");
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

  const handleUpdateCantidad = async (detalleId, nuevaCantidad, maxStock) => {
    if (nuevaCantidad < 1) {
      showNotification("La cantidad mínima es 1", "error");
      return;
    }
    
    if (nuevaCantidad > maxStock) {
      showNotification(`Stock máximo disponible: ${maxStock}`, "error");
      return;
    }

    try {
      await updateDetalleCarrito(detalleId, { cantidad: nuevaCantidad });
      showNotification("Cantidad actualizada", "success");
      cargarCarrito();
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      showNotification("Error al actualizar la cantidad", "error");
    }
  };

  const handleEliminarItem = async (detalleId) => {
    if (!window.confirm("¿Eliminar este producto del carrito?")) return;

    try {
      await deleteDetalleCarrito(detalleId);
      showNotification("Producto eliminado del carrito", "success");
      cargarCarrito();
    } catch (error) {
      console.error("Error al eliminar item:", error);
      showNotification("Error al eliminar el producto", "error");
    }
  };

  const handleProcederPago = () => {
    if (!carrito || !carrito.detalles || carrito.detalles.length === 0) {
      showNotification("El carrito está vacío", "error");
      return;
    }
    navigate("/cliente/checkout");
  };

  const calcularSubtotal = () => {
    if (!carrito || !carrito.detalles) return 0;
    return carrito.detalles.reduce((sum, item) => {
      return sum + (parseFloat(item.precio_unitario) * item.cantidad);
    }, 0);
  };

  const subtotal = calcularSubtotal();
  const descuento = 0; // Puedes implementar lógica de descuentos aquí
  const total = subtotal - descuento;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/cliente/tienda")}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span className="text-xl">←</span>
              <span>Seguir Comprando</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Mi Carrito de Compras</h1>
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
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Hola, {username}</span>
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

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8">
        {!carrito || !carrito.detalles || carrito.detalles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mb-8">
              ¡Agrega algunos productos para comenzar tu compra!
            </p>
            <button
              onClick={() => navigate("/cliente/tienda")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Productos en tu carrito ({carrito.detalles.length})
                </h2>
                
                <div className="space-y-4">
                  {carrito.detalles.map((item) => (
                    <ItemCarrito
                      key={item.id}
                      item={item}
                      onUpdateCantidad={handleUpdateCantidad}
                      onEliminar={handleEliminarItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Resumen de Compra
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} Bs.</span>
                  </div>
                  
                  {descuento > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span className="font-semibold">-{descuento.toFixed(2)} Bs.</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total:</span>
                      <span className="text-blue-600">{total.toFixed(2)} Bs.</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProcederPago}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                >
                  Proceder al Pago
                </button>

                <button
                  onClick={() => navigate("/cliente/tienda")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continuar Comprando
                </button>

                {/* Beneficios */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>Envío gratuito en compras mayores a 500 Bs.</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>Devolución gratuita dentro de 30 días</span>
                  </div>
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>Compra segura y protegida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Componente de Item del Carrito
const ItemCarrito = ({ item, onUpdateCantidad, onEliminar }) => {
  const [cantidad, setCantidad] = useState(item.cantidad);
  const producto = item.producto_info || {};
  const stockDisponible = producto.stock || 0;

  const handleCantidadChange = (nuevaCantidad) => {
    setCantidad(nuevaCantidad);
    onUpdateCantidad(item.id, nuevaCantidad, stockDisponible);
  };

  const subtotalItem = parseFloat(item.precio_unitario) * cantidad;

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/96?text=Sin+Imagen";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">📦</span>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">
              {producto.nombre || "Producto"}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Código: {producto.codigo}
            </p>
            <p className="text-sm text-gray-500">
              Precio unitario: {parseFloat(item.precio_unitario).toFixed(2)} Bs.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Stock disponible: {stockDisponible}
            </p>
          </div>

          {/* Precio Total del Item */}
          <div className="text-right">
            <p className="text-xl font-bold text-blue-600">
              {subtotalItem.toFixed(2)} Bs.
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between mt-4">
          {/* Control de Cantidad */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCantidadChange(cantidad - 1)}
              disabled={cantidad <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-12 text-center font-semibold">{cantidad}</span>
            <button
              onClick={() => handleCantidadChange(cantidad + 1)}
              disabled={cantidad >= stockDisponible}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Botón Eliminar */}
          <button
            onClick={() => onEliminar(item.id)}
            className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center space-x-1"
          >
            <span>🗑️</span>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoClientePage;
