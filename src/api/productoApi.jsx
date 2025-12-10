import apiClient from "./axiosConfig";

const BASE_URL = "inventario/productos/";

export const getProductos = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getProducto = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createProducto = async (data) => {
	// Si es FormData, axios configurará automáticamente el Content-Type
	const config = data instanceof FormData ? {
		headers: {
			'Content-Type': 'multipart/form-data',
		}
	} : {};
	
	const res = await apiClient.post(BASE_URL, data, config);
	return res.data;
};

export const updateProducto = async (id, data) => {
	// Si es FormData, axios configurará automáticamente el Content-Type
	const config = data instanceof FormData ? {
		headers: {
			'Content-Type': 'multipart/form-data',
		}
	} : {};
	
	const res = await apiClient.put(`${BASE_URL}${id}/`, data, config);
	return res.data;
};

export const deleteProducto = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};
