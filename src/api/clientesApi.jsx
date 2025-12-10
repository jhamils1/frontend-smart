import apiClient from "./axiosConfig";

const BASE_URL = "clientes/";

export const getClientes = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getCliente = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createCliente = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateCliente = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteCliente = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};
