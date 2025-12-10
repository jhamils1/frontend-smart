import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotasDeVenta, anularNotaDeVenta, limpiarComprobantes, limpiarPendientesSinPago } from '../../api/notaDeVentaApi';

const NotaDeVentaList = () => {
    const navigate = useNavigate();
    const [notasVenta, setNotasVenta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarNotasVenta();
    }, []);

    const cargarNotasVenta = async () => {
        try {
            setLoading(true);
            const data = await getNotasDeVenta();
            setNotasVenta(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar notas de venta:', err);
            setError('Error al cargar las notas de venta');
        } finally {
            setLoading(false);
        }
    };

    const handleAnular = async (id, numeroComprobante) => {
        if (!window.confirm(`¿Está seguro de anular la nota de venta ${numeroComprobante}?`)) {
            return;
        }

        try {
            await anularNotaDeVenta(id);
            alert('Nota de venta anulada correctamente');
            cargarNotasVenta();
        } catch (err) {
            console.error('Error al anular nota de venta:', err);
            alert('Error al anular la nota de venta');
        }
    };

    const handleLimpiarComprobantes = async () => {
        if (!window.confirm('⚠️ ¿Está seguro de eliminar TODOS los comprobantes?\n\nEsta acción NO se puede deshacer y eliminará:\n- Todas las notas de venta\n- Todos los detalles\n- Todos los pagos relacionados\n- Todo el historial de ventas')) {
            return;
        }

        if (!window.confirm('⚠️ ÚLTIMA CONFIRMACIÓN\n\n¿Realmente desea eliminar todos los comprobantes de prueba?')) {
            return;
        }

        try {
            await limpiarComprobantes();
            alert('✅ Todos los comprobantes han sido eliminados correctamente');
            cargarNotasVenta();
        } catch (err) {
            console.error('Error al limpiar comprobantes:', err);
            alert('❌ Error al limpiar comprobantes: ' + (err.response?.data?.detail || err.message));
        }
    };

    const handleLimpiarPendientesSinPago = async () => {
        if (!window.confirm('🧹 ¿Desea limpiar las notas de venta pendientes sin pago?\n\nEsto eliminará:\n- Notas de venta que quedaron de intentos de pago fallidos\n- Solo las que están pendientes y no tienen pago registrado\n\nLas notas de venta pagadas NO serán afectadas.')) {
            return;
        }

        try {
            const result = await limpiarPendientesSinPago();
            alert(`✅ ${result.message}\nEliminados: ${result.notas_eliminadas} comprobantes fallidos`);
            cargarNotasVenta();
        } catch (err) {
            console.error('Error al limpiar pendientes:', err);
            alert('❌ Error al limpiar pendientes: ' + (err.response?.data?.detail || err.message));
        }
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
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[estado] || badges.pendiente}`}>
                {labels[estado] || estado}
            </span>
        );
    };

    const notasVentaFiltradas = notasVenta.filter(nota => {
        if (filtroEstado !== 'todos' && nota.estado !== filtroEstado) {
            return false;
        }

        if (busqueda) {
            const searchLower = busqueda.toLowerCase();
            return (
                nota.numero_comprobante?.toLowerCase().includes(searchLower) ||
                nota.cliente_nombre?.toLowerCase().includes(searchLower) ||
                nota.cliente_ci?.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando notas de venta...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="N° comprobante, cliente, CI..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="todos">Todos los Estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="pagada">Pagada</option>
                            <option value="anulada">Anulada</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Resumen */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">📊 Resumen de Comprobantes</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLimpiarPendientesSinPago}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                            title="Eliminar intentos de pago fallidos"
                        >
                            🧹 Limpiar Fallidos
                        </button>
                        <button
                            onClick={handleLimpiarComprobantes}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            🗑️ Limpiar Todo
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm opacity-90">Total Notas de Venta</p>
                        <p className="text-2xl font-bold">{notasVentaFiltradas.length}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Pagadas</p>
                        <p className="text-2xl font-bold">
                            {notasVentaFiltradas.filter(n => n.estado === 'pagada').length}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Pendientes</p>
                        <p className="text-2xl font-bold">
                            {notasVentaFiltradas.filter(n => n.estado === 'pendiente').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Comprobante</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {notasVentaFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-lg font-medium">No hay notas de venta</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                notasVentaFiltradas.map((nota) => (
                                    <tr key={nota.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {nota.numero_comprobante}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {nota.cliente_nombre} {nota.cliente_apellido}
                                            </div>
                                            <div className="text-xs text-gray-500">CI: {nota.cliente_ci}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(nota.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                            Bs. {parseFloat(nota.subtotal).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                                            Bs. {parseFloat(nota.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getEstadoBadge(nota.estado)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => navigate(`/detalle-nota-venta/${nota.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    Ver Detalles
                                                </button>
                                                {nota.estado !== 'anulada' && (
                                                    <button
                                                        onClick={() => handleAnular(nota.id, nota.numero_comprobante)}
                                                        className="text-red-600 hover:text-red-900 font-medium"
                                                    >
                                                        Anular
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NotaDeVentaList;
