import api from './axiosConfig';

const API_URL = 'transacciones/detalle-factura/';

/**
 * API para gestionar Detalles de Factura
 */

// Obtener todos los detalles de factura
export const getDetallesFactura = async (params = {}) => {
    try {
        const response = await api.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles de factura:', error);
        throw error;
    }
};

// Obtener detalles de una factura específica
export const getDetallesByFacturaId = async (facturaId) => {
    try {
        const response = await api.get(API_URL, { 
            params: { factura: facturaId } 
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles de la factura:', error);
        throw error;
    }
};

// Obtener un detalle por ID
export const getDetalleFacturaById = async (id) => {
    try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle de factura:', error);
        throw error;
    }
};

// Crear un nuevo detalle de factura
export const createDetalleFactura = async (detalleData) => {
    try {
        const response = await api.post(API_URL, detalleData);
        return response.data;
    } catch (error) {
        console.error('Error al crear detalle de factura:', error);
        throw error;
    }
};

// Actualizar un detalle de factura
export const updateDetalleFactura = async (id, detalleData) => {
    try {
        const response = await api.put(`${API_URL}${id}/`, detalleData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar detalle de factura:', error);
        throw error;
    }
};

// Eliminar un detalle de factura
export const deleteDetalleFactura = async (id) => {
    try {
        const response = await api.delete(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar detalle de factura:', error);
        throw error;
    }
};

export default {
    getDetallesFactura,
    getDetallesByFacturaId,
    getDetalleFacturaById,
    createDetalleFactura,
    updateDetalleFactura,
    deleteDetalleFactura
};
