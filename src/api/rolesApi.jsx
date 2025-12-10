import apiClient from "./axiosConfig";

const BASE_URL = "roles/";

export const getRoles = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getRole = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createRole = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateRole = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteRole = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};

// Obtener todos los permisos
export const getPermissions = async () => {
	const res = await apiClient.get('permissions/');
	return res.data;
};
