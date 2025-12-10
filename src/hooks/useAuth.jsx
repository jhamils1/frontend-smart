import { useState } from "react";
import apiClient from "../api/axiosConfig";

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al decodificar el token:", e);
    return null;
  }
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post('token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("username", username);
      console.log(`✅ Nombre de usuario '${username}' guardado en localStorage.`);
      
      // Obtener información del usuario incluyendo el rol
      try {
        const meResponse = await apiClient.get('me/', {
          headers: {
            "Authorization": `Bearer ${access}`,
          }
        });
        const userData = meResponse.data;
        console.log("Datos del usuario desde /me/:", userData);
        
        // Guardar el rol del usuario
        if (userData.role) {
          localStorage.setItem("userRole", userData.role);
          console.log(`✅ Rol '${userData.role}' guardado en localStorage.`);
        }
      } catch (meError) {
        console.error("Error al obtener datos del usuario:", meError);
        // Si falla, intentar decodificar del token
        const userData = parseJwt(access);
        if (userData && userData.role) {
          localStorage.setItem("userRole", userData.role);
        } else if (userData && userData.groups && userData.groups.length > 0) {
          localStorage.setItem("userRole", userData.groups[0]);
        }
      }
      
      return true;
    } catch (err) {
      console.error("Error en login:", err.response?.data || err.message);
      setError("Usuario o contraseña incorrectos");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async ({ navigate } = {}) => {
    setLoading(true);
    try {
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");
      if (refresh && access) {
        const response = await apiClient.post('logout/', {
          refresh
        }, {
          headers: {
            "Authorization": `Bearer ${access}`,
          }
        });
        if (response.status === 200) {
          console.log("✅ Logout exitoso:", response.data.message);
        }
      }
    } catch (error) {
      console.warn("❌ Error al comunicarse con el backend durante logout:", error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");
      console.log("🧹 Tokens eliminados del localStorage");
      setLoading(false);
      if (navigate) {
        navigate("/login", { replace: true });
      }
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("access");
  };

  const getUserInfo = () => {
    return {
      username: localStorage.getItem("username") || "Usuario",
      userRole: localStorage.getItem("userRole") || "Sin rol",
    };
  };

  return {
    login,
    logout,
    isAuthenticated,
    getUserInfo,
    loading,
    error
  };
}
