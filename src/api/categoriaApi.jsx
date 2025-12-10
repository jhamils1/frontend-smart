import apiClient from "./axiosConfig";

const BASE_URL = "inventario/categorias/";

export const getCategorias = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getCategoria = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createCategoria = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateCategoria = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteCategoria = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};
