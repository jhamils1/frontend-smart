import apiClient from "./axiosConfig";

// Obtener información del usuario actual autenticado
export const getCurrentUser = async () => {
	const res = await apiClient.get('me/');
	return res.data;
};
