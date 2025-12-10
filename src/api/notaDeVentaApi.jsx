import api from './axiosConfig';

const API_URL = 'transacciones/nota-venta/';

/**
 * API para gestionar Notas de Venta
 */

// Obtener todas las notas de venta
export const getNotasDeVenta = async (params = {}) => {
    try {
        const response = await api.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener notas de venta:', error);
        throw error;
    }
};

// Obtener una nota de venta por ID
export const getNotaDeVentaById = async (id) => {
    try {
        const response = await api.get(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener nota de venta:', error);
        throw error;
    }
};

// Crear una nueva nota de venta
export const createNotaDeVenta = async (notaDeVentaData) => {
    try {
        const response = await api.post(API_URL, notaDeVentaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear nota de venta:', error);
        throw error;
    }
};

// Crear nota de venta desde carrito
export const createNotaDeVentaFromCarrito = async (carritoId) => {
    try {
        // Primero obtener el carrito con sus detalles
        const carritoResponse = await api.get(`inventario/carritos/${carritoId}/`);
        const carrito = carritoResponse.data;

        console.log('📦 Carrito obtenido:', carrito);
        console.log('👤 Cliente del carrito:', carrito.cliente);

        // Obtener el ID del cliente (puede venir como objeto o como ID)
        let clienteId;
        if (typeof carrito.cliente === 'object' && carrito.cliente !== null) {
            clienteId = carrito.cliente.id;
        } else {
            clienteId = carrito.cliente;
        }

        if (!clienteId) {
            throw new Error('El carrito no tiene un cliente asignado');
        }

        console.log('🆔 ID del cliente:', clienteId);

        // Generar número de comprobante único
        const numeroComprobante = `NV-${Date.now()}-${carritoId}`;

        // Crear la nota de venta
        const notaDeVentaData = {
            numero_comprobante: numeroComprobante,
            cliente: clienteId,
            estado: 'pendiente',
        };

        console.log('📝 Datos de la nota de venta a crear:', notaDeVentaData);

        const notaDeVentaResponse = await api.post(API_URL, notaDeVentaData);
        const notaDeVenta = notaDeVentaResponse.data;

        console.log('✅ Nota de venta creada:', notaDeVenta);

        // Crear los detalles de la nota de venta desde los detalles del carrito
        if (carrito.detalles && carrito.detalles.length > 0) {
            console.log('📦 Creando detalles de nota de venta...');
            
            for (const detalleCarrito of carrito.detalles) {
                // Obtener el ID del producto
                const productoId = typeof detalleCarrito.producto === 'object' 
                    ? detalleCarrito.producto.id 
                    : detalleCarrito.producto;

                // Solo enviar los campos que el modelo acepta
                const detalleData = {
                    nota_venta: notaDeVenta.id,
                    producto: productoId,
                    cantidad: parseInt(detalleCarrito.cantidad),
                };

                console.log('📝 Creando detalle:', detalleData);

                await api.post('transacciones/detalle-nota-venta/', detalleData);
            }
            
            console.log('✅ Todos los detalles creados');
        }

        // Recalcular totales de la nota de venta
        await api.post(`${API_URL}${notaDeVenta.id}/recalcular/`);

        // Obtener la nota de venta actualizada con los detalles
        const notaDeVentaActualizada = await api.get(`${API_URL}${notaDeVenta.id}/`);
        console.log('✅ Nota de venta creada exitosamente:', notaDeVentaActualizada.data);
        
        // Limpiar el carrito después de crear la nota de venta exitosamente
        try {
            console.log('🧹 Limpiando carrito después de crear nota de venta...');
            await api.delete(`inventario/carritos/${carritoId}/`);
            console.log('✅ Carrito eliminado correctamente');
        } catch (clearError) {
            console.warn('⚠️ No se pudo limpiar el carrito:', clearError);
            // No lanzar error aquí, la nota de venta ya se creó correctamente
        }
        
        return notaDeVentaActualizada.data;
    } catch (error) {
        console.error('❌ Error al crear nota de venta desde carrito:', error);
        console.error('Error completo:', error.response?.data || error.message);
        
        // Relanzar el error con un mensaje más claro
        if (error.response?.data) {
            const errorMessage = typeof error.response.data === 'object' 
                ? JSON.stringify(error.response.data) 
                : error.response.data;
            throw new Error(`Error al crear nota de venta: ${errorMessage}`);
        }
        throw error;
    }
};

// Actualizar una nota de venta
export const updateNotaDeVenta = async (id, notaDeVentaData) => {
    try {
        const response = await api.put(`${API_URL}${id}/`, notaDeVentaData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar nota de venta:', error);
        throw error;
    }
};

// Marcar nota de venta como pagada
export const marcarNotaDeVentaPagada = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/pagar/`);
        return response.data;
    } catch (error) {
        console.error('Error al marcar nota de venta como pagada:', error);
        throw error;
    }
};

// Anular una nota de venta
export const anularNotaDeVenta = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/anular/`);
        return response.data;
    } catch (error) {
        console.error('Error al anular nota de venta:', error);
        throw error;
    }
};

// Recalcular totales de una nota de venta
export const recalcularNotaDeVenta = async (id) => {
    try {
        const response = await api.post(`${API_URL}${id}/recalcular/`);
        return response.data;
    } catch (error) {
        console.error('Error al recalcular nota de venta:', error);
        throw error;
    }
};

// Eliminar una nota de venta
export const deleteNotaDeVenta = async (id) => {
    try {
        const response = await api.delete(`${API_URL}${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar nota de venta:', error);
        throw error;
    }
};

// Limpiar todas las notas de venta de prueba
export const limpiarComprobantes = async () => {
    try {
        const response = await api.delete(`${API_URL}limpiar_datos/`);
        return response.data;
    } catch (error) {
        console.error('Error al limpiar comprobantes:', error);
        throw error;
    }
};

// Limpiar solo notas de venta pendientes sin pago (intentos fallidos)
export const limpiarPendientesSinPago = async () => {
    try {
        const response = await api.delete(`${API_URL}limpiar_pendientes/`);
        return response.data;
    } catch (error) {
        console.error('Error al limpiar pendientes sin pago:', error);
        throw error;
    }
};

export default {
    getNotasDeVenta,
    getNotaDeVentaById,
    createNotaDeVenta,
    createNotaDeVentaFromCarrito,
    updateNotaDeVenta,
    marcarNotaDeVentaPagada,
    anularNotaDeVenta,
    recalcularNotaDeVenta,
    deleteNotaDeVenta,
    limpiarComprobantes,
    limpiarPendientesSinPago
};
