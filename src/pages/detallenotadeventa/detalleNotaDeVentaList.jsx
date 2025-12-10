import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotaDeVentaById } from '../../api/notaDeVentaApi';
import { getDetallesByNotaDeVentaId } from '../../api/detalleNotaDeVentaApi';

const DetalleNotaDeVentaList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notaVenta, setNotaVenta] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            cargarDetalle();
        }
    }, [id]);

    const cargarDetalle = async () => {
        try {
            setLoading(true);
            
            // Cargar la nota de venta
            const notaData = await getNotaDeVentaById(id);
            setNotaVenta(notaData);
            
            // Cargar los detalles
            const detallesData = await getDetallesByNotaDeVentaId(id);
            setDetalles(Array.isArray(detallesData) ? detallesData : []);
            
            setError(null);
        } catch (err) {
            console.error('Error al cargar detalle:', err);
            setError('Error al cargar el detalle de la nota de venta');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

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

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: "bg-yellow-100 text-yellow-800",
            pagada: "bg-green-100 text-green-800",
            anulada: "bg-gray-100 text-gray-800"
        };
        
        const labels = {
            pendiente: "⏳ Pendiente",
            pagada: "✓ Pagada",
            anulada: "⊘ Anulada"
        };

        return (
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badges[estado] || badges.pendiente}`}>
                {labels[estado] || estado}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando detalle...</p>
                </div>
            </div>
        );
    }

    if (error || !notaVenta) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                <p className="text-gray-600 mb-4">{error || 'Nota de venta no encontrada'}</p>
                <button
                    onClick={() => navigate('/ventas/comprobantes')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header - No imprimir botones */}
            <div className="flex justify-between items-center print:hidden">
                <h2 className="text-2xl font-bold text-gray-800">Comprobante de Venta</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/ventas/comprobantes')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        ← Volver
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        🖨️ Imprimir
                    </button>
                </div>
            </div>

            {/* Comprobante imprimible */}
            <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
                {/* Header del comprobante */}
                <div className="border-b-2 border-gray-300 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-600">SMART MARKET</h2>
                            <p className="text-sm text-gray-600">Sistema de Gestión de Ventas</p>
                            <p className="text-sm text-gray-600">NIT: 123456789</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-block border-2 border-indigo-600 px-4 py-2 rounded-lg">
                                <p className="text-xs text-gray-600">NOTA DE VENTA</p>
                                <p className="text-xl font-bold text-indigo-600">{notaVenta.numero_comprobante}</p>
                            </div>
                            <div className="mt-2">
                                {getEstadoBadge(notaVenta.estado)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información del cliente y fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Información del Cliente</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 font-medium">
                                {notaVenta.cliente_nombre} {notaVenta.cliente_apellido}
                            </p>
                            <p className="text-sm text-gray-600">CI: {notaVenta.cliente_ci}</p>
                            {notaVenta.cliente_telefono && (
                                <p className="text-sm text-gray-600">Tel: {notaVenta.cliente_telefono}</p>
                            )}
                            {notaVenta.cliente_email && (
                                <p className="text-sm text-gray-600">Email: {notaVenta.cliente_email}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Información de la Venta</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Fecha:</span> {formatDate(notaVenta.fecha)}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Estado:</span> {notaVenta.estado}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detalle de productos */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Detalle de Productos</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">Código</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">Producto</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">Cantidad</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b">Precio Unit.</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b">Subtotal</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {detalles && detalles.length > 0 ? (
                                    detalles.map((detalle, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-3 text-sm text-gray-800">{detalle.codigo}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">{detalle.producto_nombre}</td>
                                            <td className="px-4 py-3 text-center text-sm text-gray-800">{detalle.cantidad}</td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-800">
                                                Bs. {parseFloat(detalle.precio_unitario || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-gray-800">
                                                Bs. {parseFloat(detalle.subtotal).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                Bs. {parseFloat(detalle.total).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                            No hay detalles disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totales */}
                <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-end">
                        <div className="w-64">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-medium">Subtotal:</span>
                                <span className="text-gray-900 font-semibold">
                                    Bs. {parseFloat(notaVenta.subtotal).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between py-3 border-t-2 border-gray-300">
                                <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                                <span className="text-lg font-bold text-indigo-600">
                                    Bs. {parseFloat(notaVenta.total).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                    <p>Gracias por su compra</p>
                    <p className="mt-1">Este documento es una nota de venta válida</p>
                </div>
            </div>
        </div>
    );
};

export default DetalleNotaDeVentaList;
