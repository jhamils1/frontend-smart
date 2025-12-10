import axios from "axios";

// Configurar la URL base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: false, // Cambiar a false para evitar problemas con CORS en desarrollo
	headers: {
		'Content-Type': 'application/json',
	}
});

// Interceptor para agregar el token automáticamente a todas las peticiones
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else {
			console.warn("No hay token de acceso en localStorage. La petición puede fallar con 401.");
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		if (error.response?.status === 401) {
			console.error("Error 401: No autenticado o token expirado");
			
			// Si no hay token, redirigir al login
			const token = localStorage.getItem("access");
			if (!token) {
				console.error("No hay token disponible. Redirigiendo al login...");
				localStorage.removeItem("access");
				localStorage.removeItem("refresh");
				window.location.href = "/login";
				return Promise.reject(error);
			}
			
			// Intentar refrescar el token si está expirado
			const refreshToken = localStorage.getItem("refresh");
			if (refreshToken && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					// Crear una instancia temporal de axios sin interceptores para evitar loops infinitos
					const refreshAxios = axios.create({
						baseURL: apiClient.defaults.baseURL
					});
					
					const response = await refreshAxios.post('/token/refresh/', {
						refresh: refreshToken
					});
					
					const { access } = response.data;
					localStorage.setItem("access", access);
					
					// Reintentar la petición original con el nuevo token
					originalRequest.headers.Authorization = `Bearer ${access}`;
					return apiClient(originalRequest);
				} catch (refreshError) {
					console.error("Error al refrescar token:", refreshError);
					localStorage.removeItem("access");
					localStorage.removeItem("refresh");
					window.location.href = "/login";
					return Promise.reject(refreshError);
				}
			} else {
				// No hay refresh token o ya se intentó refrescar
				localStorage.removeItem("access");
				localStorage.removeItem("refresh");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
