import axiosInstance from "./axiosConfig";

// Crear una intencion de pago
export const createPaymentIntent = async (carritoId) => {
  try {
    const response = await axiosInstance.post("transacciones/pagos/create-payment-intent/", {
      carrito_id: carritoId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear payment intent:", error);
    throw error;
  }
};

// Confirmar el pago
export const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  try {
    const response = await axiosInstance.post("transacciones/pagos/confirm-payment/", {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentMethodId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al confirmar pago:", error);
    throw error;
  }
};

// Obtener todos los pagos
export const getPagos = async () => {
  try {
    const response = await axiosInstance.get("transacciones/pagos/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    throw error;
  }
};

// Obtener un pago por ID
export const getPagoById = async (id) => {
  try {
    const response = await axiosInstance.get(`transacciones/pagos/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener pago:", error);
    throw error;
  }
};

// Crear un pago manualmente
export const createPago = async (pagoData) => {
  try {
    const response = await axiosInstance.post("transacciones/pagos/", pagoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear pago:", error);
    throw error;
  }
};

// Actualizar un pago
export const updatePago = async (id, pagoData) => {
  try {
    const response = await axiosInstance.put(`transacciones/pagos/${id}/`, pagoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    throw error;
  }
};

// Eliminar un pago
export const deletePago = async (id) => {
  try {
    const response = await axiosInstance.delete(`transacciones/pagos/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar pago:", error);
    throw error;
  }
};
