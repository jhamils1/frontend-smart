import apiClient from "./axiosConfig";

const BASE_URL = "inventario/carritos/";

export const getCarritos = async () => {
	const res = await apiClient.get(BASE_URL);
	return res.data;
};

export const getCarrito = async (id) => {
	const res = await apiClient.get(`${BASE_URL}${id}/`);
	return res.data;
};

export const createCarrito = async (data) => {
	const res = await apiClient.post(BASE_URL, data);
	return res.data;
};

export const updateCarrito = async (id, data) => {
	const res = await apiClient.put(`${BASE_URL}${id}/`, data);
	return res.data;
};

export const deleteCarrito = async (id) => {
	const res = await apiClient.delete(`${BASE_URL}${id}/`);
	return res.data;
};

// Acciones especiales del carrito
export const completarCarrito = async (id) => {
	const res = await apiClient.post(`${BASE_URL}${id}/completar/`);
	return res.data;
};

export const abandonarCarrito = async (id) => {
	const res = await apiClient.post(`${BASE_URL}${id}/abandonar/`);
	return res.data;
};

export const limpiarCarritosActivos = async () => {
	const res = await apiClient.post(`${BASE_URL}limpiar_carritos_activos/`);
	return res.data;
};
