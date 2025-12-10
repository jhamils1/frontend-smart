import React, { useState } from "react";
import RegisterForm from "./registerForm";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		// Aquí deberías llamar a tu API de registro
		if (password !== password2) {
			setError("Las contraseñas no coinciden");
			setLoading(false);
			return;
		}
		// Simulación de éxito
		setLoading(false);
		navigate("/login");
	};

	return (
		<RegisterForm
			username={username}
			email={email}
			password={password}
			password2={password2}
			setUsername={setUsername}
			setEmail={setEmail}
			setPassword={setPassword}
			setPassword2={setPassword2}
			onSubmit={handleSubmit}
			loading={loading}
			error={error}
		/>
	);
};

export default RegisterPage;
