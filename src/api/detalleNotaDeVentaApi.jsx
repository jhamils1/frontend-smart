import api from './axiosConfig';

const API_URL = 'transacciones/detalle-nota-venta/';

/**
 * API para gestionar Detalles de Nota de Venta
 */

// Obtener todos los detalles de nota de venta
export const getDetallesNotaDeVenta = async (params = {}) => {
    try {
        const response = await api.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles de nota de venta:', error);
        throw error;
    }
};

// Obtener detalles por ID de nota de venta
export const getDetallesByNotaDeVentaId = async (notaVentaId) => {
    try {
        const response = await api.get(API_URL, { 
            params: { nota_venta: notaVentaId } 
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles de nota de venta:', error);
        throw error;
    }
};

// Obtener un detalle de nota de venta por ID
export const getDetalleNotaDeVentaById = async (id) => {
    try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle de nota de venta:', error);
        throw error;
    }
};

// Crear un nuevo detalle de nota de venta
export const createDetalleNotaDeVenta = async (detalleData) => {
    try {
        const response = await api.post(API_URL, detalleData);
        return response.data;
    } catch (error) {
        console.error('Error al crear detalle de nota de venta:', error);
        throw error;
    }
};

// Actualizar un detalle de nota de venta
export const updateDetalleNotaDeVenta = async (id, detalleData) => {
    try {
        const response = await api.put(`${API_URL}${id}/`, detalleData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar detalle de nota de venta:', error);
        throw error;
    }
};

// Eliminar un detalle de nota de venta
export const deleteDetalleNotaDeVenta = async (id) => {
    try {
        const response = await api.delete(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar detalle de nota de venta:', error);
        throw error;
    }
};

export default {
    getDetallesNotaDeVenta,
    getDetallesByNotaDeVentaId,
    getDetalleNotaDeVentaById,
    createDetalleNotaDeVenta,
    updateDetalleNotaDeVenta,
    deleteDetalleNotaDeVenta
};
