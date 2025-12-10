import React, { useState, useEffect } from 'react';
import { getHistorialVentaDetalle, actualizarEstadoPago, anularVenta } from '../../api/historialVentasApi';
import Button from '../../components/button';

const HistorialVentasDetalle = ({ ventaId, onClose }) => {
    const [venta, setVenta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actualizando, setActualizando] = useState(false);

    useEffect(() => {
        if (ventaId) {
            cargarDetalle();
        }
    }, [ventaId]);

    const cargarDetalle = async () => {
        try {
            setLoading(true);
            const data = await getHistorialVentaDetalle(ventaId);
            setVenta(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar detalle:', err);
            setError('Error al cargar el detalle de la venta');
        } finally {
            setLoading(false);
        }
    };

    const handleActualizarEstado = async (nuevoEstado) => {
        if (!window.confirm(`¿Confirma cambiar el estado a "${nuevoEstado}"?`)) return;

        try {
            setActualizando(true);
            await actualizarEstadoPago(ventaId, nuevoEstado);
            await cargarDetalle();
            alert('Estado actualizado correctamente');
        } catch (err) {
            console.error('Error al actualizar estado:', err);
            alert('Error al actualizar el estado');
        } finally {
            setActualizando(false);
        }
    };

    const handleAnular = async () => {
        if (!window.confirm('¿Está seguro de anular esta venta? Esta acción no se puede deshacer.')) return;

        try {
            setActualizando(true);
            await anularVenta(ventaId);
            await cargarDetalle();
            alert('Venta anulada correctamente');
        } catch (err) {
            console.error('Error al anular venta:', err);
            alert('Error al anular la venta');
        } finally {
            setActualizando(false);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatearMoneda = (monto) => {
        return `Bs. ${parseFloat(monto || 0).toFixed(2)}`;
    };

    const getEstadoColor = (estado) => {
        const colors = {
            completado: 'bg-green-500',
            pendiente: 'bg-yellow-500',
            fallido: 'bg-red-500',
            anulado: 'bg-gray-500'
        };
        return colors[estado] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !venta) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || 'No se pudo cargar la información de la venta'}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Venta #{venta.numero_venta}</h2>
                        <p className="text-blue-100">Fecha: {formatearFecha(venta.fecha_venta)}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${getEstadoColor(venta.estado_pago)} text-white font-semibold`}>
                        {venta.estado_pago?.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Nombre</p>
                        <p className="font-medium">{venta.cliente_nombre}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">CI</p>
                        <p className="font-medium">{venta.cliente_ci}</p>
                    </div>
                    {venta.cliente_email && (
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{venta.cliente_email}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detalle de Productos */}
            {venta.productos_vendidos && venta.productos_vendidos.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Productos ({venta.productos_vendidos.length} items)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {venta.productos_vendidos.map((producto, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3">{producto.producto_nombre}</td>
                                        <td className="px-4 py-3 text-center">{producto.cantidad}</td>
                                        <td className="px-4 py-3 text-right">{formatearMoneda(producto.precio_unitario)}</td>
                                        <td className="px-4 py-3 text-right">{formatearMoneda(producto.subtotal)}</td>
                                        <td className="px-4 py-3 text-right font-semibold">{formatearMoneda(producto.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Resumen de Montos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Resumen de Montos
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatearMoneda(venta.subtotal)}</span>
                    </div>
                    {venta.descuento > 0 && (
                        <div className="flex justify-between text-red-600">
                            <span>Descuento:</span>
                            <span className="font-medium">-{formatearMoneda(venta.descuento)}</span>
                        </div>
                    )}
                    {venta.impuesto > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Impuesto (IVA):</span>
                            <span className="font-medium">{formatearMoneda(venta.impuesto)}</span>
                        </div>
                    )}
                    <div className="border-t-2 border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between text-lg font-bold">
                            <span>TOTAL:</span>
                            <span className="text-green-600">{formatearMoneda(venta.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del Pago */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Información del Pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Método de Pago</p>
                        <p className="font-medium">{venta.metodo_pago}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium capitalize">{venta.estado_pago}</p>
                    </div>
                    {venta.fecha_pago && (
                        <div>
                            <p className="text-sm text-gray-500">Fecha de Pago</p>
                            <p className="font-medium">{formatearFecha(venta.fecha_pago)}</p>
                        </div>
                    )}
                    {venta.referencia_pago && (
                        <div>
                            <p className="text-sm text-gray-500">Referencia</p>
                            <p className="font-medium text-xs">{venta.referencia_pago}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Notas */}
            {venta.notas && (
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold mb-2">Notas</h3>
                    <p className="text-gray-700">{venta.notas}</p>
                </div>
            )}

            {/* Acciones */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Acciones</h3>
                <div className="flex flex-wrap gap-3">
                    {venta.estado_pago !== 'anulado' && (
                        <>
                            {venta.estado_pago === 'pendiente' && (
                                <Button
                                    onClick={() => handleActualizarEstado('completado')}
                                    disabled={actualizando}
                                    variant="success"
                                >
                                    Marcar como Completado
                                </Button>
                            )}
                            
                            {venta.estado_pago === 'completado' && (
                                <Button
                                    onClick={() => handleActualizarEstado('pendiente')}
                                    disabled={actualizando}
                                    variant="warning"
                                >
                                    Marcar como Pendiente
                                </Button>
                            )}

                            <Button
                                onClick={handleAnular}
                                disabled={actualizando}
                                variant="danger"
                            >
                                Anular Venta
                            </Button>
                        </>
                    )}
                    
                    <Button
                        onClick={onClose}
                        variant="secondary"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HistorialVentasDetalle;
