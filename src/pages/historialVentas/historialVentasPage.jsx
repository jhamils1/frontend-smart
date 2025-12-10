import React, { useState } from 'react';
import Layout from '../../components/layout';
import HistorialVentasList from './historialVentasList';
import HistorialVentasDetalle from './historialVentasDetalle';
import Button from '../../components/button';
import { limpiarDatosPrueba } from '../../api/historialVentasApi';

const HistorialVentasPage = () => {
    const [vistaActual, setVistaActual] = useState('lista'); // 'lista' o 'detalle'
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [limpiando, setLimpiando] = useState(false);
    const [refrescar, setRefrescar] = useState(0);

    const handleVerDetalle = (ventaId) => {
        setVentaSeleccionada(ventaId);
        setVistaActual('detalle');
    };

    const handleVolverLista = () => {
        setVentaSeleccionada(null);
        setVistaActual('lista');
    };

    const handleLimpiarDatos = async () => {
        const confirmacion = window.confirm(
            '⚠️ ATENCIÓN: Esta acción eliminará TODAS las ventas del historial.\n\n' +
            '¿Estás seguro de que deseas continuar?\n\n' +
            'Esta acción NO se puede deshacer.'
        );

        if (!confirmacion) return;

        const segundaConfirmacion = window.confirm(
            '🚨 ÚLTIMA CONFIRMACIÓN\n\n' +
            'Se eliminarán todas las facturas, pagos y registros de ventas.\n\n' +
            '¿Confirmas que deseas limpiar todos los datos de prueba?'
        );

        if (!segundaConfirmacion) return;

        try {
            setLimpiando(true);
            await limpiarDatosPrueba();
            alert('✅ Datos de prueba eliminados correctamente');
            // Forzar recarga del componente
            setRefrescar(prev => prev + 1);
        } catch (error) {
            console.error('Error al limpiar datos:', error);
            alert('❌ Error al limpiar datos de prueba: ' + (error.message || 'Error desconocido'));
        } finally {
            setLimpiando(false);
        }
    };

    return (
        <Layout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Historial de Ventas
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {vistaActual === 'lista' 
                                    ? 'Consulta el histórico completo de todas las ventas realizadas'
                                    : 'Detalle de la venta seleccionada'
                                }
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            {vistaActual === 'lista' && (
                                <Button
                                    onClick={handleLimpiarDatos}
                                    disabled={limpiando}
                                    variant="danger"
                                    className="flex items-center"
                                >
                                    {limpiando ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Limpiando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            🧪 Limpiar Datos de Prueba
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            {vistaActual === 'detalle' && (
                                <Button
                                    onClick={handleVolverLista}
                                    variant="secondary"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver al Listado
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-500">
                        <li>
                            <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </li>
                        <li>
                            <span className="text-gray-800 font-medium">Historial de Ventas</span>
                        </li>
                        {vistaActual === 'detalle' && (
                            <>
                                <li>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </li>
                                <li>
                                    <span className="text-gray-800 font-medium">Detalle</span>
                                </li>
                            </>
                        )}
                    </ol>
                </nav>

                {/* Contenido */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {vistaActual === 'lista' ? (
                        <HistorialVentasList 
                            key={refrescar}
                            onVerDetalle={handleVerDetalle} 
                        />
                    ) : (
                        <HistorialVentasDetalle 
                            ventaId={ventaSeleccionada} 
                            onClose={handleVolverLista}
                        />
                    )}
                </div>

                {/* Información adicional */}
                {vistaActual === 'lista' && (
                    <div className="mt-6 space-y-4">
                        {/* Información del módulo */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">Sobre el Historial de Ventas</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Este módulo registra automáticamente todas las ventas completadas con pago.</li>
                                        <li>• Puede filtrar por fecha, estado, cliente y método de pago.</li>
                                        <li>• Las ventas completadas pueden ser anuladas si es necesario.</li>
                                        <li>• Los registros incluyen información detallada de productos, montos y pagos.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HistorialVentasPage;
