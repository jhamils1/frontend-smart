import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const username = localStorage.getItem("username") || "Usuario";
  const userRole = localStorage.getItem("userRole") || "Sin rol";

  // Simulación de datos para las tarjetas y la tabla
  const statsData = [
    { label: "Ventas", value: 120, icon: "💰", color: "bg-blue-100" },
    { label: "Clientes", value: 45, icon: "👥", color: "bg-green-100" },
    { label: "Pedidos", value: 32, icon: "📦", color: "bg-yellow-100" },
    { label: "Empleados", value: 8, icon: "🧑‍💼", color: "bg-indigo-100" },
  ];
  const recentOrders = [
    { id: 1, cliente: "Juan Pérez", fecha: "2025-10-25", estado: "Completado", monto: "$120.00" },
    { id: 2, cliente: "Ana Gómez", fecha: "2025-10-26", estado: "En proceso", monto: "$80.00" },
    { id: 3, cliente: "Carlos Ruiz", fecha: "2025-10-27", estado: "Enviado", monto: "$150.00" },
  ];

  const handleLogout = () => {
    // Aquí va la lógica de logout
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isVisible={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header principal sin logo */}
        <header className="bg-white shadow-sm p-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>
        {/* Contenido */}
        <div className="p-6">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsData.map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-lg shadow p-6 transform hover:scale-105 transition-transform`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <span className="text-4xl opacity-80">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Gráficos placeholders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span>📈</span> Predicción de Ventas (IA)
              </h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-lg font-medium">Gráfico de Predicción de Ventas</p>
                  <p className="text-sm">(líneas, barras, comparativas)</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span>👥</span> Análisis de Clientes
              </h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-lg font-medium">Distribución de Clientes</p>
                  <p className="text-sm">(por categoría y comportamiento)</p>
                </div>
              </div>
            </div>
          </div>
          {/* Tabla de últimas órdenes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span>📋</span> Últimos Pedidos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID Pedido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.cliente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.estado === "Completado" ? "bg-green-100 text-green-800" :
                          order.estado === "Enviado" ? "bg-blue-100 text-blue-800" :
                          order.estado === "En proceso" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {order.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{order.monto}</td>
                    </tr>
                  ))}
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
