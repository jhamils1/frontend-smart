import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button.jsx";
import { confirmPayment, createPago } from "../../api/pagoApi.jsx";
import { createNotaDeVentaFromCarrito, marcarNotaDeVentaPagada } from "../../api/notaDeVentaApi.jsx";
import { crearDesdeNotaDeVenta } from "../../api/historialVentasApi.jsx";

const CheckoutForm = ({ clientSecret, onSuccess, onCancel, totalAmount, carritoId }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
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
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setCardExpiry(formatted);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCardCvc(value);
    }
  };

  const validateCard = () => {
    const cardNum = cardNumber.replace(/\s/g, "");
    if (cardNum.length !== 16) {
      return "Número de tarjeta inválido";
    }

    const expiryParts = cardExpiry.split("/");
    if (expiryParts.length !== 2) {
      return "Fecha de expiración inválida";
    }

    const month = parseInt(expiryParts[0]);
    const year = parseInt(expiryParts[1]);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      return "Mes inválido";
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Tarjeta expirada";
    }

    if (cardCvc.length < 3 || cardCvc.length > 4) {
      return "CVC inválido";
    }

    if (!cardName.trim()) {
      return "Nombre del titular requerido";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Simulación de procesamiento de pago
      // En producción, aquí integrarías con Stripe Elements
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular éxito del pago
      if (Math.random() > 0.1) { // 90% de éxito para demo
        console.log("💳 Pago procesado exitosamente");

        // 1. Crear la nota de venta desde el carrito
        console.log("📄 Creando nota de venta desde carrito:", carritoId);
        const notaVenta = await createNotaDeVentaFromCarrito(carritoId);
        console.log("✅ Nota de venta creada:", notaVenta);

        // 2. Crear el registro en el pago (simulado con payment_intent_id)
        const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("💳 Payment Intent ID:", paymentIntentId);

        // Crear el registro de pago
        const pagoData = {
          nota_venta: notaVenta.id,
          monto: notaVenta.total,
          moneda: 'USD',
          total_stripe: paymentIntentId
        };
        
        console.log("💰 Creando registro de pago:", pagoData);
        await createPago(pagoData);

        // 3. Marcar la nota de venta como pagada
        console.log("✅ Marcando nota de venta como pagada");
        await marcarNotaDeVentaPagada(notaVenta.id);

        // 4. Registrar en el historial de ventas
        console.log("📊 Registrando en historial de ventas");
        await crearDesdeNotaDeVenta(notaVenta.id);
        console.log("✅ Registro histórico creado");

        // 5. Navegar a la página de éxito con la información completa
        navigate("/pago/success", {
          state: {
            notaVenta: notaVenta,
            pagoInfo: {
              orden: notaVenta.numero_comprobante,
              notaVentaId: notaVenta.id,
              monto: notaVenta.total,
              subtotal: notaVenta.subtotal,
              metodo: "Stripe",
              estado: "Completado",
              paymentIntentId: paymentIntentId,
              fecha: new Date().toISOString(),
              cliente: notaVenta.cliente_nombre + " " + notaVenta.cliente_apellido,
              detalles: notaVenta.detalles
            }
          }
        });
      } else {
        throw new Error("El pago fue rechazado. Por favor, intenta con otra tarjeta.");
      }
    } catch (err) {
      console.error("Error al procesar pago:", err);
      setError(err.message || "Error al procesar el pago");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre del titular */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Titular
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="JUAN PÉREZ"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Número de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Tarjeta
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
          <div className="absolute right-3 top-3 flex gap-1">
            <svg className="w-8 h-6" viewBox="0 0 32 20" fill="none">
              <rect width="32" height="20" rx="2" fill="#252525"/>
              <circle cx="12" cy="10" r="5" fill="#EB001B"/>
              <circle cx="20" cy="10" r="5" fill="#F79E1B"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fecha de expiración */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Expiración
          </label>
          <input
            type="text"
            value={cardExpiry}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
        </div>

        {/* CVC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <input
            type="text"
            value={cardCvc}
            onChange={handleCvcChange}
            placeholder="123"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
        </div>
      </div>

      {/* Información de tarjetas de prueba */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">💳 Tarjetas de Prueba:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p><strong>Éxito:</strong> 4242 4242 4242 4242</p>
          <p><strong>Rechazo:</strong> 4000 0000 0000 0002</p>
          <p><strong>Fecha:</strong> Cualquier fecha futura (ej: 12/25)</p>
          <p><strong>CVC:</strong> Cualquier 3 dígitos (ej: 123)</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total a Pagar:</span>
          <span className="text-2xl font-bold text-indigo-600">Bs. {parseFloat(totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="cancelar"
          onClick={onCancel}
          disabled={processing}
          className="flex-1"
        >
          Cancelar
        </Button>
        <button
          type="submit"
          disabled={processing}
          className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            `Pagar Bs. ${parseFloat(totalAmount).toFixed(2)}`
          )}
        </button>
      </div>

      {/* Nota de seguridad */}
      <p className="text-xs text-center text-gray-500 mt-4">
        🔒 Tu información de pago está protegida con encriptación SSL de 256 bits
      </p>
    </form>
  );
};

export default CheckoutForm;
