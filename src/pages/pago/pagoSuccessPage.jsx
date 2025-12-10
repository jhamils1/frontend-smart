import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import Button from "../../components/button.jsx";

const PagoSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pagoInfo = location.state?.pagoInfo;
  const notaVenta = location.state?.notaVenta;

  // Si no hay información del pago, redirigir
  if (!pagoInfo) {
    navigate("/carrito");
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Mensaje de éxito */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            {/* Icono de éxito */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Tu pago ha sido procesado correctamente y se ha generado tu nota de venta.
            </p>

            {/* Información básica del pago */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 font-medium text-sm">N° Comprobante:</span>
                  <p className="text-gray-900 font-bold text-lg">{pagoInfo.orden}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm">Total Pagado:</span>
                  <p className="text-green-600 font-bold text-2xl">
                    Bs. {parseFloat(pagoInfo.monto || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm">Cliente:</span>
                  <p className="text-gray-900 font-semibold">{pagoInfo.cliente || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm">Estado:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    ✓ Completado
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalle de la Nota de Venta */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="border-b-2 border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📄 Nota de Venta</h2>
              <p className="text-gray-600">N° {pagoInfo.orden}</p>
              <p className="text-sm text-gray-500">Fecha: {formatDate(pagoInfo.fecha)}</p>
            </div>

            {/* Detalles de productos */}
            {pagoInfo.detalles && pagoInfo.detalles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio Unit.
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagoInfo.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {detalle.producto_nombre}
                            </div>
                            <div className="text-xs text-gray-500">
                              Código: {detalle.producto_codigo}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-900">
                            {detalle.cantidad}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            Bs. {parseFloat(detalle.precio_unitario).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                            Bs. {parseFloat(detalle.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totales */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-gray-900 font-semibold">
                    Bs. {parseFloat(pagoInfo.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-t-2 border-gray-300 pt-3 mt-3">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    Bs. {parseFloat(pagoInfo.monto || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del pago */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Información del Pago</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Método de Pago:</span>
                  <p className="font-semibold text-gray-900">{pagoInfo.metodo || "Stripe"}</p>
                </div>
                <div>
                  <span className="text-gray-600">ID de Transacción:</span>
                  <p className="font-mono text-xs text-gray-900 break-all">
                    {pagoInfo.paymentIntentId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/historial-ventas")}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md"
              >
                📊 Ver Historial de Ventas
              </button>
              <button
                onClick={() => navigate("/carrito")}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold shadow-md"
              >
                🛒 Nuevo Carrito
              </button>
            </div>
          </div>

          {/* Mensaje informativo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-800">
                Tu nota de venta ha sido registrada exitosamente. Puedes consultar todos tus pagos 
                y comprobantes en el <strong>Historial de Ventas</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoSuccessPage;
