import apiClient from "./axiosConfig";

const BASE_URL = "empleados/";

export const getEmpleados = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getEmpleado = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createEmpleado = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateEmpleado = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteEmpleado = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};
