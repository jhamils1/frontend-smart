import axios from './axiosConfig.js';

/**
 * Obtiene las ventas históricas agrupadas por período
 * @param {string} periodo - 'mes', 'semestre', 'anio'
 * @param {string} fechaInicio - Fecha de inicio (opcional, formato: YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin (opcional, formato: YYYY-MM-DD)
 * @returns {Promise} - Promise con los datos de ventas históricas
 */
export const getVentasHistoricas = async (periodo = 'mes', fechaInicio = null, fechaFin = null) => {
    try {
        const params = { periodo };
        if (fechaInicio) params.fecha_inicio = fechaInicio;
        if (fechaFin) params.fecha_fin = fechaFin;
        
        const response = await axios.get('/analitica/dashboard/ventas-historicas/', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ventas históricas:', error);
        throw error;
    }
};

/**
 * Obtiene el ranking de clientes por cantidad de compras
 * @param {string} tipo - 'top' (más compras) o 'bottom' (menos compras)
 * @param {number} limite - Cantidad de clientes a mostrar
 * @returns {Promise} - Promise con el ranking de clientes
 */
export const getClientesRanking = async (tipo = 'top', limite = 10) => {
    try {
        const response = await axios.get('/analitica/dashboard/clientes-ranking/', {
            params: { tipo, limite }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ranking de clientes:', error);
        throw error;
    }
};

/**
 * Obtiene el ranking de productos por ventas
 * @param {string} tipo - 'top' (más vendidos) o 'bottom' (menos vendidos)
 * @param {number} limite - Cantidad de productos a mostrar
 * @returns {Promise} - Promise con el ranking de productos
 */
export const getProductosRanking = async (tipo = 'top', limite = 10) => {
    try {
        const response = await axios.get('/analitica/dashboard/productos-ranking/', {
            params: { tipo, limite }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener ranking de productos:', error);
        throw error;
    }
};

/**
 * Obtiene un resumen general del dashboard con KPIs principales
 * @returns {Promise} - Promise con el resumen general
 */
export const getResumenGeneral = async () => {
    try {
        const response = await axios.get('/analitica/dashboard/resumen-general/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener resumen general:', error);
        throw error;
    }
};
