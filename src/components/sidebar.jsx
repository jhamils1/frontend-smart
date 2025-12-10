import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSmart from "../assets/logosmart.png";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const Sidebar = ({ isVisible = true, onToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openCatalogo, setOpenCatalogo] = useState(false);
  const [openVentas, setOpenVentas] = useState(false);
  const [openAnalitica, setOpenAnalitica] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(localStorage.getItem("username") || "Usuario");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "Sin rol");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Usuario");
    setUserRole(localStorage.getItem("userRole") || "Sin rol");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Menú y submenús (referencia interna; el render está ordenado manualmente debajo)
  // Orden solicitado: Dashboard, Productos (Catálogo, Categoría), Clientes, Carrito de Compra,
  // Ventas (Visualizar Comprobantes, Listado Histórico), Analítica, Administración
  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/admin/dashboard" },
    { icon: "📦", label: "Productos", path: "/productos" },
    { icon: "👥", label: "Clientes", path: "/clientes" },
    { icon: "🛒", label: "Carrito de Compra", path: "/carrito" },
    { icon: "💸", label: "Ventas", path: "/ventas" },
    { icon: "📊", label: "Analítica", path: "/analitica" },
    { icon: "⚙️", label: "Administración", path: "/administracion" },
  ];

  const ventasSubmenu = [
    { label: "Carrito de Compra", path: "/carrito" },
    { label: "Visualizar Comprobantes", path: "/ventas/comprobantes" },
    { label: "Listado Histórico", path: "/historial-ventas" },
  ];

  const adminSubmenu = [
    { label: "Rol", path: "/administracion/rol" },
    { label: "Usuario", path: "/administracion/usuario" },
    { label: "Empleado", path: "/administracion/empleado" },
  ];

  const productosSubmenu = [
    { label: "Catalogo", path: "/productos/producto" },
    { label: "Categoria", path: "/productos/categoria" },
  ];

  const analiticaSubmenu = [
    { label: "Dashboard Predictivo", path: "/analitica/dashboard-predictivo" },
    { label: "Generación de Reportes Dinámicos", path: "/analitica/reportes" },
    { label: "Entrenamiento del Modelo IA", path: "/analitica/entrenamiento-ia" },
  ];

  return (
    <aside className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
      {/* Header con logo y toggle */}
      <div className="pt-10 pb-6 flex flex-col items-center justify-center border-b border-gray-700">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-center justify-center w-full">
            {isSidebarOpen && (
              <>
                <img src={logoSmart} alt="Logo Smart Sales 365" style={{ width: "120px", marginBottom: "1.5rem" }} />
                <p className="text-xs text-gray-400 mb-2">Sistema de Gestión Comercial</p>
              </>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white ml-2 mr-4"
            style={{ fontSize: '2rem', position: 'relative', top: '-22px' }}
          >
            ☰
          </button>
        </div>
      </div>
      {/* Menú de navegación (orden según solicitud) */}
      <nav className="flex-1 py-3">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition`}
        >
          <span className="text-xl">🏠</span>
          {isSidebarOpen && <span className="text-sm font-medium">Dashboard</span>}
        </button>
        {/* Productos con submenú */}
        <div className="relative">
          <button
            onClick={() => setOpenCatalogo(!openCatalogo)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition`}
          >
            <span className="text-xl">📦</span>
            {isSidebarOpen && <span className="text-sm font-medium">Productos</span>}
            {isSidebarOpen && (
              <span className="ml-auto">
                {openCatalogo ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
          </button>
          {isSidebarOpen && openCatalogo && (
            <div className="ml-8 mt-1 flex flex-col gap-1">
              {productosSubmenu.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(sub.path)}
                  className="text-left px-2 py-2 hover:bg-gray-700 rounded"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Clientes */}
        <button
          onClick={() => navigate("/clientes")}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition`}
        >
          <span className="text-xl">👥</span>
          {isSidebarOpen && <span className="text-sm font-medium">Clientes</span>}
        </button>
        {/* (Carrito ahora está dentro del submenú de Ventas) */}
        {/* Ventas con submenú */}
        <div className="relative">
          <button
            onClick={() => setOpenVentas(!openVentas)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition`}
          >
            <span className="text-xl">💸</span>
            {isSidebarOpen && <span className="text-sm font-medium">Ventas</span>}
            {isSidebarOpen && (
              <span className="ml-auto">
                {openVentas ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
          </button>
          {isSidebarOpen && openVentas && (
            <div className="ml-8 mt-1 flex flex-col gap-1">
              {ventasSubmenu.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(sub.path)}
                  className="text-left px-2 py-2 hover:bg-gray-700 rounded"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Analítica con submenú */}
        <div className="relative">
          <button
            onClick={() => setOpenAnalitica(!openAnalitica)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition`}
          >
            <span className="text-xl">📊</span>
            {isSidebarOpen && <span className="text-sm font-medium">Analítica</span>}
            {isSidebarOpen && (
              <span className="ml-auto">
                {openAnalitica ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
          </button>
          {isSidebarOpen && openAnalitica && (
            <div className="ml-8 mt-1 flex flex-col gap-1">
              {analiticaSubmenu.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(sub.path)}
                  className="text-left px-2 py-2 hover:bg-gray-700 rounded"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Menú Administración con submenú */}
        <div className="relative">
          <button
            onClick={() => setOpenAdmin(!openAdmin)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition`}
          >
            <span className="text-xl">⚙️</span>
            {isSidebarOpen && <span className="text-sm font-medium">Administración</span>}
            {isSidebarOpen && (
              <span className="ml-auto">
                {openAdmin ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
          </button>
          {isSidebarOpen && openAdmin && (
            <div className="ml-8 mt-1 flex flex-col gap-1">
              {adminSubmenu.map((sub, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(sub.path)}
                  className="text-left px-2 py-2 hover:bg-gray-700 rounded"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      {/* Perfil y Logout */}
      <div className="border-t border-gray-700 p-4">
        {isSidebarOpen && (
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=4F46E5&color=fff&size=40`}
              alt="avatar"
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">{username}</p>
              <p className="text-xs text-gray-400">{userRole}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full bg-red-600 hover:bg-red-700 py-2 px-3 rounded transition flex items-center justify-center gap-2`}
        >
          <span>🚪</span>
          {isSidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
