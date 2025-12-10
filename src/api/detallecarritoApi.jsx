import apiClient from "./axiosConfig";

const BASE_URL = "inventario/detalles-carrito/";

export const getDetallesCarrito = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getDetalleCarrito = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createDetalleCarrito = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateDetalleCarrito = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteDetalleCarrito = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};

// Obtener detalles por carrito
export const getDetallesByCarrito = async (carritoId) => {
	const res = await apiClient.get(`${BASE_URL}?carrito=${carritoId}`);
	return res.data;
};

// Añadir producto al carrito (alias de createDetalleCarrito para mayor claridad)
export const addDetalleCarrito = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};
