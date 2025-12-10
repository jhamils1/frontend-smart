import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCarritos, getCarrito } from "../../api/carritoApi";
import { createNotaDeVenta } from "../../api/notaDeVentaApi";
import { getCurrentUser } from "../../api/meApi";
import { useAuth } from "../../hooks/useAuth";

const CheckoutClientePage = () => {
  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const { username } = getUserInfo();
  
  const [carrito, setCarrito] = useState(null);
  const [clienteData, setClienteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    direccion_envio: "",
    ci: "",
    notas: ""
  });
  
  // Datos de la tarjeta
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del usuario actual
      const userData = await getCurrentUser();
      setClienteData(userData.cliente);
      
      // Pre-llenar el formulario con datos del cliente
      if (userData.cliente) {
        const nombreCompleto = `${userData.cliente.nombre || ''} ${userData.cliente.apellido || ''}`.trim();
        setFormData(prev => ({
          ...prev,
          nombre_completo: nombreCompleto,
          telefono: userData.cliente.telefono || '',
          direccion_envio: userData.cliente.direccion || '',
          ci: userData.cliente.ci || ''
        }));
        
        // Pre-llenar también el nombre del titular de la tarjeta
        setCardData(prev => ({
          ...prev,
          cardName: nombreCompleto.toUpperCase()
        }));
      }
      
      // Obtener carrito activo
      const carritos = await getCarritos();
      const carritoActivo = carritos.find(c => c.estado === 'activo');
      
      if (carritoActivo && carritoActivo.id) {
        const carritoCompleto = await getCarrito(carritoActivo.id);
        
        if (!carritoCompleto.detalles || carritoCompleto.detalles.length === 0) {
          showNotification("Tu carrito está vacío", "error");
          setTimeout(() => navigate("/cliente/tienda"), 2000);
          return;
        }
        
        setCarrito(carritoCompleto);
      } else {
        showNotification("No se encontró un carrito activo", "error");
        setTimeout(() => navigate("/cliente/tienda"), 2000);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funciones de formateo de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setCardData(prev => ({ ...prev, cardExpiry: formatted }));
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCardData(prev => ({ ...prev, cardCvc: value }));
    }
  };

  const validateCard = () => {
    const cardNum = cardData.cardNumber.replace(/\s/g, "");
    if (cardNum.length !== 16) return "Número de tarjeta inválido";

    const expiryParts = cardData.cardExpiry.split("/");
    if (expiryParts.length !== 2) return "Fecha de expiración inválida";

    const month = parseInt(expiryParts[0]);
    const year = parseInt(expiryParts[1]);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) return "Mes inválido";
    if (year < currentYear || (year === currentYear && month < currentMonth)) return "Tarjeta expirada";
    if (cardData.cardCvc.length < 3 || cardData.cardCvc.length > 4) return "CVC inválido";
    if (!cardData.cardName.trim()) return "Nombre del titular requerido";

    return null;
  };

  const calcularSubtotal = () => {
    if (!carrito || !carrito.detalles) return 0;
    return carrito.detalles.reduce((sum, item) => {
      return sum + (parseFloat(item.precio_unitario) * item.cantidad);
    }, 0);
  };

  const handleProcesarPago = async (e) => {
    e.preventDefault();
    
    // Validaciones de formulario
    if (!formData.nombre_completo.trim()) {
      showNotification("Por favor ingresa tu nombre completo", "error");
      return;
    }
    
    if (!formData.telefono.trim()) {
      showNotification("Por favor ingresa tu teléfono", "error");
      return;
    }
    
    if (!formData.direccion_envio.trim()) {
      showNotification("Por favor ingresa tu dirección de envío", "error");
      return;
    }

    // Validación de tarjeta
    const cardError = validateCard();
    if (cardError) {
      showNotification(cardError, "error");
      return;
    }

    try {
      setProcesando(true);
      
      // Simulación de procesamiento de pago con Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular éxito del pago (90% de éxito)
      if (Math.random() > 0.1) {
        console.log("💳 Pago procesado exitosamente");
        
        // Importar APIs necesarias
        const { createNotaDeVentaFromCarrito, marcarNotaDeVentaPagada } = await import('../../api/notaDeVentaApi');
        const { createPago } = await import('../../api/pagoApi');
        const { crearDesdeNotaDeVenta } = await import('../../api/historialVentasApi');
        
        // 1. Crear nota de venta desde el carrito
        const notaVenta = await createNotaDeVentaFromCarrito(carrito.id);
        console.log("✅ Nota de venta creada:", notaVenta);
        
        // 2. Crear registro de pago
        const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await createPago({
          nota_venta: notaVenta.id,
          monto: notaVenta.total,
          moneda: 'USD',
          total_stripe: paymentIntentId
        });
        
        // 3. Marcar como pagada
        await marcarNotaDeVentaPagada(notaVenta.id);
        
        // 4. Registrar en historial
        await crearDesdeNotaDeVenta(notaVenta.id);
        
        showNotification("¡Pedido realizado exitosamente!", "success");
        
        // Redirigir a confirmación
        setTimeout(() => {
          navigate("/cliente/pedido-exitoso", { 
            state: { 
              notaVenta,
              pagoInfo: {
                orden: notaVenta.numero_comprobante,
                monto: notaVenta.total,
                metodo: "Stripe",
                estado: "Completado",
                paymentIntentId
              }
            } 
          });
        }, 1500);
      } else {
        throw new Error("El pago fue rechazado. Por favor, intenta con otra tarjeta.");
      }
      
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      showNotification(error.message || "Error al procesar el pedido. Intenta nuevamente.", "error");
    } finally {
      setProcesando(false);
    }
  };

  const subtotal = calcularSubtotal();
  const envio = subtotal >= 500 ? 0 : 30; // Envío gratis para compras mayores a 500 Bs
  const total = subtotal + envio;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando checkout...</p>
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
              onClick={() => navigate("/cliente/carrito")}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span className="text-xl">←</span>
              <span>Volver al Carrito</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Finalizar Compra</h1>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Hola, {username}</span>
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <span className="text-xl">👤</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Datos */}
          <div className="lg:col-span-2">
            <form onSubmit={handleProcesarPago} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Datos de Envío
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CI/NIT (Opcional)
                    </label>
                    <input
                      type="text"
                      name="ci"
                      value={formData.ci}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección de Envío *
                  </label>
                  <textarea
                    name="direccion_envio"
                    value={formData.direccion_envio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Información de Pago con Stripe */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    💳 Información de Pago (Stripe)
                  </h3>
                  
                  {/* Nombre en la tarjeta */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Titular *
                    </label>
                    <input
                      type="text"
                      value={cardData.cardName}
                      onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                      placeholder="JUAN PÉREZ"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Número de tarjeta */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Tarjeta *
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Fecha de expiración y CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha de Expiración *
                      </label>
                      <input
                        type="text"
                        value={cardData.cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        value={cardData.cardCvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas adicionales (Opcional)
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Ej: Tocar timbre dos veces, entregar en recepción..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Resumen del Pedido
              </h2>
              
              {/* Lista de productos */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {carrito?.detalles?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.producto_info?.nombre || item.producto_nombre || "Producto"}
                      </p>
                      <p className="text-gray-500">
                        {item.cantidad} x {parseFloat(item.precio_unitario).toFixed(2)} Bs.
                      </p>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {(parseFloat(item.precio_unitario) * item.cantidad).toFixed(2)} Bs.
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-3 mb-6 pt-6 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} Bs.</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span className="font-semibold">
                    {envio === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `${envio.toFixed(2)} Bs.`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
                  <span>Total:</span>
                  <span className="text-blue-600">{total.toFixed(2)} Bs.</span>
                </div>
              </div>

              {/* Botón de confirmar */}
              <button
                onClick={handleProcesarPago}
                disabled={procesando}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  procesando
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {procesando ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Confirmar Pedido"
                )}
              </button>

              {/* Información de seguridad */}
              <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Pago seguro y protegido</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Envío gratis en compras mayores a 500 Bs.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Garantía de devolución</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutClientePage;
