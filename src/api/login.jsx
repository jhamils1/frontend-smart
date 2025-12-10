import apiClient from "./axiosConfig";

async function login(username, password) {
	try {
		const res = await apiClient.post('token/', {
			username,
			password,
		});

		const { access, refresh } = res.data;

		// Guardar tokens
		localStorage.setItem("access", access);
		localStorage.setItem("refresh", refresh);

		console.log("Login correcto ✅");
		return true;
	} catch (err) {
		console.error("Error login ❌:", err.response?.data);
		return false;
	}
}

export default login;
