import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./loginForm";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
	const { login, loading, error, getUserInfo } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await login(username, password);
		if (success) {
			console.log("✅ Login exitoso");
			
			// Obtener el rol del usuario para redirigir apropiadamente
			const { userRole } = getUserInfo();
			console.log("Rol del usuario:", userRole);
			
			// Redirigir según el rol
			if (userRole === 'Cliente' || userRole === 'cliente') {
				navigate("/cliente/tienda");
			} else {
				// Admin, empleados y otros roles van al dashboard
				navigate("/admin/dashboard");
			}
		}
	};

	return (
		<LoginForm
			username={username}
			password={password}
			setUsername={setUsername}
			setPassword={setPassword}
			onSubmit={handleSubmit}
			loading={loading}
			error={error}
		/>
	);
};

export default LoginPage;

