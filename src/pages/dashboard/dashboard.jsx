import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  getVentasHistoricas,
  getClientesRanking,
  getProductosRanking,
  getResumenGeneral
} from "../../api/dashboardApi.jsx";
import {
  getVentasFuturas,
  getTendencias,
  getProductosDemandados
} from "../../api/prediccionApi.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const username = localStorage.getItem("username") || "Usuario";
  const userRole = localStorage.getItem("userRole") || "Sin rol";

  // Estados para los datos del dashboard
  const [loading, setLoading] = useState(true);
  const [resumenGeneral, setResumenGeneral] = useState(null);
  const [ventasHistoricas, setVentasHistoricas] = useState([]);
  const [clientesRanking, setClientesRanking] = useState([]);
  const [productosRanking, setProductosRanking] = useState([]);
  const [periodoVentas, setPeriodoVentas] = useState('mes');
  const [tipoClientes, setTipoClientes] = useState('top');
  const [tipoProductos, setTipoProductos] = useState('top');
  
  // Estados para predicciones
  const [prediccionesVentas, setPrediccionesVentas] = useState(null);
  const [tendencias, setTendencias] = useState(null);
  const [productosDemandados, setProductosDemandados] = useState([]);
  const [mesesPrediccion, setMesesPrediccion] = useState(6);
  
  // Estados de carga individuales para cada gráfico
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingPredicciones, setLoadingPredicciones] = useState(false);
  const [loadingTendencias, setLoadingTendencias] = useState(false);
  const [loadingDemanda, setLoadingDemanda] = useState(false);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Cargar ventas cuando cambia el período
  useEffect(() => {
    if (!loading) { // Solo ejecutar después de la carga inicial
      cargarVentasHistoricas();
    }
  }, [periodoVentas]);

  // Cargar clientes cuando cambia el tipo
  useEffect(() => {
    if (!loading) { // Solo ejecutar después de la carga inicial
      cargarClientesRanking();
    }
  }, [tipoClientes]);

  // Cargar productos cuando cambia el tipo
  useEffect(() => {
    if (!loading) { // Solo ejecutar después de la carga inicial
      cargarProductosRanking();
    }
  }, [tipoProductos]);

  // Cargar predicciones cuando cambia los meses
  useEffect(() => {
    if (!loading) {
      cargarPredicciones();
    }
  }, [mesesPrediccion]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      // Cargar todos los datos en paralelo solo al inicio
      const [resumen, ventas, clientes, productos, predicciones, tendenciasData, demanda] = await Promise.all([
        getResumenGeneral(),
        getVentasHistoricas(periodoVentas),
        getClientesRanking(tipoClientes, 5),
        getProductosRanking(tipoProductos, 5),
        getVentasFuturas(mesesPrediccion).catch(() => null),
        getTendencias().catch(() => null),
        getProductosDemandados(5).catch(() => null)
      ]);

      console.log('📊 Datos iniciales del Dashboard:', { resumen, ventas, clientes, productos, predicciones, tendenciasData, demanda });

      setResumenGeneral(resumen || null);
      setVentasHistoricas(ventas?.datos || []);
      setClientesRanking(clientes?.datos || []);
      setProductosRanking(productos?.datos || []);
      setPrediccionesVentas(predicciones || null);
      setTendencias(tendenciasData || null);
      setProductosDemandados(demanda?.productos_alta_demanda || []);
    } catch (error) {
      console.error('❌ Error al cargar datos del dashboard:', error);
      setResumenGeneral(null);
      setVentasHistoricas([]);
      setClientesRanking([]);
      setProductosRanking([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarVentasHistoricas = async () => {
    setLoadingVentas(true);
    try {
      const ventas = await getVentasHistoricas(periodoVentas);
      console.log('📈 Ventas actualizadas:', ventas);
      setVentasHistoricas(ventas?.datos || []);
    } catch (error) {
      console.error('❌ Error al cargar ventas históricas:', error);
      setVentasHistoricas([]);
    } finally {
      setLoadingVentas(false);
    }
  };

  const cargarClientesRanking = async () => {
    setLoadingClientes(true);
    try {
      const clientes = await getClientesRanking(tipoClientes, 5);
      console.log('👥 Clientes actualizados:', clientes);
      setClientesRanking(clientes?.datos || []);
    } catch (error) {
      console.error('❌ Error al cargar clientes:', error);
      setClientesRanking([]);
    } finally {
      setLoadingClientes(false);
    }
  };

  const cargarProductosRanking = async () => {
    setLoadingProductos(true);
    try {
      const productos = await getProductosRanking(tipoProductos, 5);
      console.log('🏆 Productos actualizados:', productos);
      setProductosRanking(productos?.datos || []);
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
      setProductosRanking([]);
    } finally {
      setLoadingProductos(false);
    }
  };

  const cargarPredicciones = async () => {
    setLoadingPredicciones(true);
    try {
      const predicciones = await getVentasFuturas(mesesPrediccion);
      console.log('🔮 Predicciones actualizadas:', predicciones);
      setPrediccionesVentas(predicciones || null);
    } catch (error) {
      console.error('❌ Error al cargar predicciones:', error);
      setPrediccionesVentas(null);
    } finally {
      setLoadingPredicciones(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Colores para los gráficos
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Formato de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isVisible={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isVisible={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header principal */}
        <header className="bg-white shadow-sm p-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Analítico</h1>
          <p className="text-gray-500 mt-2">Bienvenido, {username}</p>
        </header>

        {/* Contenido */}
        <div className="p-6">
          {/* KPIs - Tarjetas de resumen */}
          {resumenGeneral?.kpis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total Ventas</p>
                    <p className="text-3xl font-bold mt-2 text-blue-900">{resumenGeneral.kpis.total_ventas || 0}</p>
                    {resumenGeneral?.comparativa_mensual?.variacion && (
                      <p className={`text-xs mt-1 ${resumenGeneral.comparativa_mensual.variacion.ventas_porcentaje >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resumenGeneral.comparativa_mensual.variacion.ventas_porcentaje >= 0 ? '↑' : '↓'} {Math.abs(resumenGeneral.comparativa_mensual.variacion.ventas_porcentaje)}% vs mes anterior
                      </p>
                    )}
                  </div>
                  <span className="text-4xl opacity-80">💰</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Ingresos Totales</p>
                    <p className="text-2xl font-bold mt-2 text-green-900">{formatCurrency(resumenGeneral.kpis.total_ingresos || 0)}</p>
                    {resumenGeneral?.comparativa_mensual?.variacion && (
                      <p className={`text-xs mt-1 ${resumenGeneral.comparativa_mensual.variacion.ingresos_porcentaje >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resumenGeneral.comparativa_mensual.variacion.ingresos_porcentaje >= 0 ? '↑' : '↓'} {Math.abs(resumenGeneral.comparativa_mensual.variacion.ingresos_porcentaje)}% vs mes anterior
                      </p>
                    )}
                  </div>
                  <span className="text-4xl opacity-80">📊</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Clientes Activos</p>
                    <p className="text-3xl font-bold mt-2 text-purple-900">{resumenGeneral.kpis.clientes_activos || 0}</p>
                    <p className="text-xs mt-1 text-purple-600">Ticket promedio: {formatCurrency(resumenGeneral.kpis.ticket_promedio || 0)}</p>
                  </div>
                  <span className="text-4xl opacity-80">👥</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800">Productos Vendidos</p>
                    <p className="text-3xl font-bold mt-2 text-orange-900">{resumenGeneral.kpis.unidades_vendidas || 0}</p>
                    <p className="text-xs mt-1 text-orange-600">{resumenGeneral.kpis.productos_vendidos || 0} productos únicos</p>
                  </div>
                  <span className="text-4xl opacity-80">📦</span>
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de Ventas Históricas */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span>📈</span> Ventas Históricas
                {loadingVentas && <span className="text-sm text-blue-500 ml-2">Cargando...</span>}
              </h3>
              <select
                value={periodoVentas}
                onChange={(e) => setPeriodoVentas(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingVentas}
              >
                <option value="mes">Por Mes</option>
                <option value="semestre">Por Semestre</option>
                <option value="anio">Por Año</option>
              </select>
            </div>
            {loadingVentas ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : ventasHistoricas && ventasHistoricas.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasHistoricas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo_nombre" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'Total Ingresos') {
                        return [formatCurrency(value), name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="total_ventas"
                    name="Total Ventas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total_ingresos"
                    name="Total Ingresos"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">No hay datos de ventas históricas</p>
                  <p className="text-sm">Los datos aparecerán cuando haya ventas registradas</p>
                </div>
              </div>
            )}
          </div>

          {/* Predicciones de Ventas con IA */}
          {prediccionesVentas && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span>🔮</span> Predicciones de Ventas (IA - Random Forest)
                    {loadingPredicciones && <span className="text-sm text-blue-500 ml-2">Cargando...</span>}
                  </h3>
                  {prediccionesVentas.cerebro_info && (
                    <p className="text-xs text-gray-500 mt-1">
                      Modelo: {prediccionesVentas.cerebro_info.tipo} | Entrenado: {prediccionesVentas.cerebro_info.fecha_entrenamiento}
                    </p>
                  )}
                </div>
                <select
                  value={mesesPrediccion}
                  onChange={(e) => setMesesPrediccion(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loadingPredicciones}
                >
                  <option value={3}>3 meses</option>
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                </select>
              </div>
              {loadingPredicciones ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={[
                      ...(prediccionesVentas.historico || []),
                      ...(prediccionesVentas.predicciones || [])
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={(item) => item.mes || item.mes_nombre} 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                                <p className="font-semibold text-sm">{data.mes || data.mes_nombre}</p>
                                {data.ventas !== undefined && (
                                  <p className="text-blue-600 text-sm">Ventas: {data.ventas}</p>
                                )}
                                {data.ventas_predichas !== undefined && (
                                  <p className="text-purple-600 text-sm">
                                    Predicción: {data.ventas_predichas}
                                    {data.confianza && <span className="ml-1 text-xs">({data.confianza})</span>}
                                  </p>
                                )}
                                {data.ingresos !== undefined && (
                                  <p className="text-green-600 text-sm">Ingresos: {formatCurrency(data.ingresos)}</p>
                                )}
                                {data.ingresos_predichos !== undefined && (
                                  <p className="text-orange-600 text-sm">
                                    Ingresos Pred.: {formatCurrency(data.ingresos_predichos)}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      
                      {/* Datos históricos */}
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="ventas" 
                        name="Ventas Históricas" 
                        fill="#3b82f680" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="ingresos"
                        name="Ingresos Históricos"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      
                      {/* Predicciones */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="ventas_predichas"
                        name="Predicción Ventas (IA)"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="ingresos_predichos"
                        name="Predicción Ingresos (IA)"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                  
                  {/* Resumen de predicciones */}
                  {prediccionesVentas.predicciones && prediccionesVentas.predicciones.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-600 font-semibold">Próximo Mes</p>
                        <p className="text-lg font-bold text-purple-900">
                          {prediccionesVentas.predicciones[0].ventas_predichas} ventas
                        </p>
                        <p className="text-xs text-purple-700">
                          {formatCurrency(prediccionesVentas.predicciones[0].ingresos_predichos)}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 font-semibold">Promedio Predicho</p>
                        <p className="text-lg font-bold text-blue-900">
                          {Math.round(prediccionesVentas.predicciones.reduce((acc, p) => acc + p.ventas_predichas, 0) / prediccionesVentas.predicciones.length)} ventas/mes
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 font-semibold">Ingresos Totales Estimados</p>
                        <p className="text-lg font-bold text-green-900">
                          {formatCurrency(prediccionesVentas.predicciones.reduce((acc, p) => acc + p.ingresos_predichos, 0))}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Tendencias y Productos Demandados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Tendencias de Productos */}
            {tendencias && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Tendencias de Productos
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <span>📈</span> En Alza ({tendencias.productos_en_alza?.length || 0})
                    </h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {tendencias.productos_en_alza?.slice(0, 5).map((producto, idx) => (
                        <div key={idx} className="bg-green-50 p-2 rounded flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{producto.nombre}</p>
                            <p className="text-xs text-gray-600">{producto.codigo}</p>
                          </div>
                          <span className="text-green-600 font-bold">+{producto.cambio_porcentual}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                      <span>📉</span> En Baja ({tendencias.productos_en_baja?.length || 0})
                    </h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {tendencias.productos_en_baja?.slice(0, 5).map((producto, idx) => (
                        <div key={idx} className="bg-red-50 p-2 rounded flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{producto.nombre}</p>
                            <p className="text-xs text-gray-600">{producto.codigo}</p>
                          </div>
                          <span className="text-red-600 font-bold">{producto.cambio_porcentual}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Productos Alta Demanda */}
            {productosDemandados.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎯</span> Alta Demanda Predicha
                </h3>
                <div className="space-y-3 max-h-[450px] overflow-y-auto">
                  {productosDemandados.map((producto, idx) => (
                    <div key={idx} className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{producto.nombre}</p>
                          <p className="text-xs text-gray-600">{producto.codigo}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                          Score: {producto.score_prioridad}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Stock actual:</p>
                          <p className="font-semibold">{producto.stock_actual}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Demanda 90d:</p>
                          <p className="font-semibold">{producto.demanda_predicha_90dias}</p>
                        </div>
                      </div>
                      {producto.recomendacion && (
                        <div className={`mt-2 p-2 rounded text-xs ${
                          producto.recomendacion.nivel === 'urgente' ? 'bg-red-100 text-red-800' :
                          producto.recomendacion.nivel === 'moderado' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          <p className="font-semibold">{producto.recomendacion.mensaje}</p>
                          <p>Sugerido: {producto.recomendacion.cantidad_sugerida} unidades</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gráficos de Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Ranking de Productos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span>🏆</span> Productos Más Vendidos
                  {loadingProductos && <span className="text-sm text-blue-500 ml-2">Cargando...</span>}
                </h3>
                <select
                  value={tipoProductos}
                  onChange={(e) => setTipoProductos(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingProductos}
                >
                  <option value="top">Top 5</option>
                  <option value="bottom">Bottom 5</option>
                </select>
              </div>
              {loadingProductos ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : productosRanking && productosRanking.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productosRanking} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="producto_nombre" type="category" width={150} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'Total Ingresos') {
                          return [formatCurrency(value), name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total_vendido" name="Unidades Vendidas" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">No hay datos de productos</p>
                    <p className="text-sm">Los datos aparecerán cuando haya ventas registradas</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ranking de Clientes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span>⭐</span> Clientes Top
                  {loadingClientes && <span className="text-sm text-blue-500 ml-2">Cargando...</span>}
                </h3>
                <select
                  value={tipoClientes}
                  onChange={(e) => setTipoClientes(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingClientes}
                >
                  <option value="top">Top 5</option>
                  <option value="bottom">Bottom 5</option>
                </select>
              </div>
              {loadingClientes ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : clientesRanking && clientesRanking.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientesRanking}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cliente_nombre" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name.includes('Gastado') || name.includes('Promedio')) {
                          return [formatCurrency(value), name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total_compras" name="Total Compras" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">No hay datos de clientes</p>
                    <p className="text-sm">Los datos aparecerán cuando haya ventas registradas</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de Detalles de Clientes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>📋</span> Detalles de Clientes Top
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CI</th>
                    {clientesRanking.length > 0 && clientesRanking[0].cliente_email && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Compras</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Gastado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Promedio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientesRanking.length > 0 ? (
                    clientesRanking.map((cliente, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.cliente_nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cliente.cliente_ci}</td>
                        {cliente.cliente_email && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.cliente_email}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">{cliente.total_compras}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{formatCurrency(cliente.total_gastado)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(cliente.compra_promedio)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
