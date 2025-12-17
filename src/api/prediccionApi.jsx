import axios from './axiosConfig.js';

/**
 * Obtiene predicciones de ventas futuras usando Random Forest
 * @param {number} meses - Número de meses a predecir (por defecto: 6)
 * @returns {Promise} - Promise con las predicciones
 */
export const getVentasFuturas = async (meses = 6) => {
    try {
        const response = await axios.get('/analitica/predicciones/ventas-futuras/', {
            params: { meses }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener predicciones de ventas:', error);
        throw error;
    }
};

/**
 * Obtiene análisis de tendencias de productos
 * @returns {Promise} - Promise con las tendencias
 */
export const getTendencias = async () => {
    try {
        const response = await axios.get('/analitica/predicciones/tendencias/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener tendencias:', error);
        throw error;
    }
};

/**
 * Obtiene predicción de productos con alta demanda
 * @param {number} limite - Número de productos a retornar
 * @returns {Promise} - Promise con los productos demandados
 */
export const getProductosDemandados = async (limite = 10) => {
    try {
        const response = await axios.get('/analitica/predicciones/productos-demandados/', {
            params: { limite }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos demandados:', error);
        throw error;
    }
};

/**
 * Obtiene información y métricas del modelo de predicción
 * @returns {Promise} - Promise con la información del modelo
 */
export const getMetricasModelo = async () => {
    try {
        const response = await axios.get('/analitica/predicciones/metricas-modelo/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener métricas del modelo:', error);
        throw error;
    }
};
