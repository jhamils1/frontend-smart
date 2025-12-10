import apiClient from "./axiosConfig";

const BASE_URL = "usuarios/";

export const getUsuarios = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getUsuario = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createUsuario = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateUsuario = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteUsuario = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};
