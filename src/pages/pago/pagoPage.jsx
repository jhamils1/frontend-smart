import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPaymentIntent } from "../../api/pagoApi.jsx";
import CheckoutForm from "./checkoutForm.jsx";
import Sidebar from "../../components/sidebar.jsx";
import Button from "../../components/button.jsx";

const PagoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrito, setCarrito] = useState(null);

  useEffect(() => {
    // Obtener el carrito del state de navegación
    if (location.state?.carrito) {
      setCarrito(location.state.carrito);
      initializePayment(location.state.carrito.id);
    } else {
      setError("No se encontró información del carrito");
      setLoading(false);
    }
  }, [location]);

  const initializePayment = async (carritoId) => {
    try {
      setLoading(true);
      const response = await createPaymentIntent(carritoId);
      setClientSecret(response.clientSecret);
      setError(null);
    } catch (err) {
      console.error("Error al inicializar pago:", err);
      setError(err.response?.data?.error || "Error al inicializar el pago");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate("/carrito", { 
      state: { 
        message: "¡Pago realizado exitosamente!" 
      } 
    });
  };

  const handleCancel = () => {
    navigate("/carrito");
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Preparando el pago...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-800">💳 Procesar Pago</h1>
          </header>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center mb-4">
                <svg className="w-12 h-12 text-red-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-red-800">Error al procesar el pago</h3>
                  <p className="text-red-600 mt-2">{error}</p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="cancelar" onClick={handleCancel}>
                  Volver al Carrito
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">💳 Procesar Pago</h1>
        </header>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Resumen del pedido */}
            {carrito && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Carrito</p>
                    <p className="text-lg font-semibold text-gray-800">#{carrito.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="text-lg font-semibold text-gray-800">{carrito.cliente_nombre || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Items</p>
                    <p className="text-lg font-semibold text-gray-800">{carrito.total_items || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total a Pagar</p>
                    <p className="text-2xl font-bold text-indigo-600">Bs. {parseFloat(carrito.total_carrito || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de pago */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Información de Pago</h2>
              {clientSecret ? (
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleCancel}
                  totalAmount={carrito?.total_carrito || 0}
                  carritoId={carrito?.id}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No se pudo inicializar el pago
                </div>
              )}
            </div>

            {/* Información de seguridad */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Pago Seguro</h4>
                  <p className="text-sm text-blue-700">
                    Tu información de pago está protegida con encriptación de nivel bancario. 
                    Procesamos pagos de forma segura a través de Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoPage;
