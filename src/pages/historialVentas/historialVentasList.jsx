import React, { useState, useEffect } from 'react';
import { getHistorialVentas } from '../../api/historialVentasApi';
import Table from '../../components/table';
import Button from '../../components/button';

const HistorialVentasList = ({ onVerDetalle }) => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        estado: '',
        fecha_inicio: '',
        fecha_fin: '',
        metodo: ''
    });

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            setLoading(true);
            const params = {};
            
            if (filters.search) params.search = filters.search;
            if (filters.estado) params.estado = filters.estado;
            if (filters.fecha_inicio) params.fecha_inicio = filters.fecha_inicio;
            if (filters.fecha_fin) params.fecha_fin = filters.fecha_fin;
            if (filters.metodo) params.metodo = filters.metodo;
            
            const data = await getHistorialVentas(params);
            setVentas(Array.isArray(data) ? data : data.results || []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar ventas:', err);
            setError('Error al cargar el historial de ventas');
            setVentas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const limpiarFiltros = () => {
        setFilters({
            search: '',
            estado: '',
            fecha_inicio: '',
            fecha_fin: '',
            metodo: ''
        });
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleString('es-BO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatearMoneda = (monto) => {
        return `Bs. ${parseFloat(monto).toFixed(2)}`;
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            completado: 'bg-green-100 text-green-800',
            pendiente: 'bg-yellow-100 text-yellow-800',
            fallido: 'bg-red-100 text-red-800',
            anulado: 'bg-gray-100 text-gray-800'
        };
        
        const labels = {
            completado: 'Completado',
            pendiente: 'Pendiente',
            fallido: 'Fallido',
            anulado: 'Anulado'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[estado] || 'bg-gray-100 text-gray-800'}`}>
                {labels[estado] || estado}
            </span>
        );
    };

    const columns = [
        {
            header: 'N° Venta',
            accessor: 'numero_venta',
            cell: (row) => (
                <span className="font-semibold text-blue-600">{row.numero_venta}</span>
            )
        },
        {
            header: 'Cliente',
            accessor: 'cliente_nombre',
            cell: (row) => (
                <div>
                    <div className="font-medium">{row.cliente_nombre}</div>
                    <div className="text-sm text-gray-500">CI: {row.cliente_ci}</div>
                </div>
            )
        },
        {
            header: 'Fecha',
            accessor: 'fecha_venta',
            cell: (row) => (
                <span className="text-sm">{formatearFecha(row.fecha_venta)}</span>
            )
        },
        {
            header: 'Total',
            accessor: 'total',
            cell: (row) => (
                <span className="font-semibold text-green-600">{formatearMoneda(row.total)}</span>
            )
        },
        {
            header: 'Estado',
            accessor: 'estado_pago',
            cell: (row) => getEstadoBadge(row.estado_pago)
        },
        {
            header: 'Método',
            accessor: 'metodo_pago',
            cell: (row) => (
                <span className="text-sm">{row.metodo_pago}</span>
            )
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => onVerDetalle(row.nota_venta)}
                        variant="secondary"
                        size="sm"
                    >
                        Ver Detalle
                    </Button>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar
                        </label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="N° venta, cliente, CI..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={filters.estado}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="completado">Completado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="fallido">Fallido</option>
                            <option value="anulado">Anulado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={filters.fecha_inicio}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            name="fecha_fin"
                            value={filters.fecha_fin}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button
                            onClick={cargarVentas}
                            variant="primary"
                            className="flex-1"
                        >
                            Buscar
                        </Button>
                        <Button
                            onClick={limpiarFiltros}
                            variant="secondary"
                            className="flex-1"
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Resumen */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-90">Total de Ventas</p>
                        <p className="text-2xl font-bold">{ventas.length}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Total Recaudado</p>
                        <p className="text-2xl font-bold">
                            {formatearMoneda(ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0))}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : ventas.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No se encontraron ventas</p>
                </div>
            ) : (
                <Table columns={columns} data={ventas} />
            )}
        </div>
    );
};

export default HistorialVentasList;
