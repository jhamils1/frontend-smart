import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PedidoExitosoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notaVenta, carrito } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        {/* Icono de éxito */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Pedido Realizado Exitosamente!
          </h1>
          <p className="text-gray-600">
            Tu pedido ha sido registrado y será procesado pronto
          </p>
        </div>

        {/* Información del pedido */}
        {notaVenta && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Detalles del Pedido
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Número de Pedido:</span>
                <span className="font-semibold text-gray-800">#{notaVenta.id || 'XXXX'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-blue-600 text-lg">
                  {parseFloat(notaVenta.total || 0).toFixed(2)} Bs.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Próximos pasos */}
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ¿Qué sigue ahora?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">Confirmación</p>
                <p className="text-sm text-gray-600">
                  Recibirás un correo de confirmación con los detalles de tu pedido
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">Preparación</p>
                <p className="text-sm text-gray-600">
                  Nuestro equipo preparará tu pedido con cuidado
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">Envío</p>
                <p className="text-sm text-gray-600">
                  Te contactaremos para coordinar la entrega
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/cliente/tienda")}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Seguir Comprando
          </button>
          <button
            onClick={() => navigate("/cliente/pedidos")}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Ver Mis Pedidos
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
          <p>¿Necesitas ayuda? Contáctanos al teléfono <span className="font-semibold">70000000</span></p>
          <p className="mt-1">o envíanos un correo a <span className="font-semibold">soporte@tienda.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default PedidoExitosoPage;
