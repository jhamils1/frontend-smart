import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Importa tus páginas aquí (ajusta los paths según tu estructura real)
import LoginPage from "../pages/login/loginPage.jsx";
import RegisterPage from "../pages/register/registerPage.jsx";
import Dashboard from "../pages/dashboard/dashboard.jsx";
import ClientePage from "../pages/cliente/clientePage.jsx";

import RolesPage from "../pages/roles/rolesPage.jsx";
import UserPage from "../pages/usuario/userPage.jsx";

import EmpleadoPage from "../pages/empleado/empleadoPage.jsx";
import CategoriaPage from "../pages/categoria/categoriaPage.jsx";
import ProductoPage from "../pages/producto/productoPage.jsx";

import CarritoPage from "../pages/carrito/carritoPage.jsx";
import DetalleCarritoPage from "../pages/detallecarrito/detalleCarritoPage.jsx";
import PagoPage from "../pages/pago/pagoPage.jsx";
import PagoSuccessPage from "../pages/pago/pagoSuccessPage.jsx";
import HistorialVentasPage from "../pages/historialVentas/historialVentasPage.jsx";
import NotaDeVentaPage from "../pages/notadeventa/notaDeVentaPage.jsx";
import DetalleNotaDeVentaPage from "../pages/detallenotadeventa/detalleNotaDeVentaPage.jsx";
import ReportesPage from "../pages/reportes/ReportesPage.jsx";

// Páginas de cliente/tienda
import TiendaPage from "../pages/tienda/tiendaPage.jsx";
import CarritoClientePage from "../pages/tienda/carritoClientePage.jsx";
import CheckoutClientePage from "../pages/tienda/checkoutClientePage.jsx";
import PedidoExitosoPage from "../pages/tienda/pedidoExitosoPage.jsx";
import MisPedidosPage from "../pages/tienda/misPedidosPage.jsx";

// Ejemplo de layout, dashboard y otras páginas (puedes agregar más según tu proyecto)
// import Layout from "../pages/layout";
// import Dashboard from "../pages/dashboard/dashboard.jsx";

const AdminRoutes = () => {
	const isAuthenticated = !!localStorage.getItem("access");
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	// Aquí puedes envolver con Layout si tienes uno
	return <Outlet />;
};

const ClienteRoutes = () => {
	const isAuthenticated = !!localStorage.getItem("access");
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
};

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				
				{/* Rutas protegidas para ADMINISTRADORES */}
				<Route element={<AdminRoutes />}>
					<Route path="/admin/dashboard" element={<Dashboard />} />
					<Route path="/clientes" element={<ClientePage />} />
					<Route path="/administracion/empleado" element={<EmpleadoPage />} />
					<Route path="/administracion/rol" element={<RolesPage />} />
					<Route path="/administracion/usuario" element={<UserPage />} />
					<Route path="/productos/categoria" element={<CategoriaPage />} />
					<Route path="/productos/producto" element={<ProductoPage />} />
					<Route path="/carrito" element={<CarritoPage />} />
					<Route path="/detallecarrito" element={<DetalleCarritoPage />} />
					<Route path="/pago" element={<PagoPage />} />
					<Route path="/pago/success" element={<PagoSuccessPage />} />
					<Route path="/historial-ventas" element={<HistorialVentasPage />} />
					<Route path="/ventas/comprobantes" element={<NotaDeVentaPage />} />
					<Route path="/detalle-nota-venta/:id" element={<DetalleNotaDeVentaPage />} />
					<Route path="/analitica/reportes" element={<ReportesPage />} />
				</Route>

				{/* Rutas protegidas para CLIENTES */}
				<Route element={<ClienteRoutes />}>
					<Route path="/cliente/tienda" element={<TiendaPage />} />
					<Route path="/cliente/carrito" element={<CarritoClientePage />} />
					<Route path="/cliente/checkout" element={<CheckoutClientePage />} />
					<Route path="/cliente/pedido-exitoso" element={<PedidoExitosoPage />} />
					<Route path="/cliente/pedidos" element={<MisPedidosPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
