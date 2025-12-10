import React, { useState, useEffect } from "react";
import { getBackups, restoreBackup, createBackup, ejecutarBackupAutomatico, getEstadisticas, getProximoBackup } from "../../api/backupApi";
import SuccessNotification from "../../components/succesessnotification";

const BackupList = () => {
  const [backups, setBackups] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [backupToRestore, setBackupToRestore] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [tiempoRestante, setTiempoRestante] = useState({ horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    cargarBackups();
    cargarEstadisticas();
    // Cargar próximo backup después de un pequeño delay para no bloquear
    setTimeout(() => cargarProximoBackup(), 500);
  }, []);

  // Actualizar temporizador cada segundo
  useEffect(() => {
    const calcularTiempoRestante = () => {
      const ahora = new Date();
      const proximaEjecucion = new Date();
      proximaEjecucion.setHours(23, 59, 0, 0);
      
      // Si ya pasaron las 23:59 hoy, calcular para mañana
      if (ahora >= proximaEjecucion) {
        proximaEjecucion.setDate(proximaEjecucion.getDate() + 1);
      }
      
      const diferencia = Math.max(0, Math.floor((proximaEjecucion - ahora) / 1000));
      const horas = Math.floor(diferencia / 3600);
      const minutos = Math.floor((diferencia % 3600) / 60);
      const segundos = diferencia % 60;
      
      setTiempoRestante({ horas, minutos, segundos });
    };

    // Calcular inmediatamente
    calcularTiempoRestante();
    
    // Actualizar cada segundo
    const intervalo = setInterval(calcularTiempoRestante, 1000);
    
    return () => clearInterval(intervalo);
  }, []);

  const cargarBackups = async (mostrarLoading = true) => {
    try {
      if (mostrarLoading) {
        setLoading(true);
      }
      const data = await getBackups();
      // Asegurar que todos los backups tengan los campos necesarios
      const backupsConDatos = Array.isArray(data) ? data.map(backup => ({
        ...backup,
        tamanio_mb: backup.tamanio_mb || 0,
        creado_por_username: backup.creado_por_username || "Sistema",
        fecha_creacion: backup.fecha_creacion || new Date().toISOString(),
        estado: backup.estado || "en_proceso",
        tipo: backup.tipo || "manual"
      })) : [];
      setBackups(backupsConDatos);
    } catch (error) {
      console.error("Error detallado al cargar backups:", error);
      const mensajeError = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          error.response?.data?.message ||
                          error.message || 
                          "Error al cargar backups";
      mostrarNotificacion(mensajeError, "error");
      throw error; // Re-lanzar para que el botón de actualizar lo capture
    } finally {
      if (mostrarLoading) {
        setLoading(false);
      }
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const data = await getEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      // No mostrar notificación para estadísticas ya que no es crítico
    }
  };

  const cargarProximoBackup = async () => {
    try {
      const data = await getProximoBackup();
      if (data && data.tiempo_restante) {
        setTiempoRestante(data.tiempo_restante);
      }
    } catch (error) {
      // No mostrar error si falla el temporizador, solo loguearlo
      console.warn("Error al cargar próximo backup (no crítico):", error);
      // No establecer valores por defecto aquí, el temporizador local los calculará
    }
  };

  const mostrarNotificacion = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleCrearBackup = async () => {
    try {
      // Verificar que hay token antes de intentar crear el backup
      const token = localStorage.getItem("access");
      if (!token) {
        mostrarNotificacion("No estás autenticado. Por favor, inicia sesión.", "error");
        setShowModal(false);
        return;
      }

      await createBackup(formData);
      mostrarNotificacion("Backup iniciado exitosamente. Se completará en breve.");
      setShowModal(false);
      setFormData({ nombre: "", descripcion: "" });
      setTimeout(cargarBackups, 2000);
      setTimeout(cargarEstadisticas, 2000);
    } catch (error) {
      console.error("Error detallado al crear backup:", error);
      const mensajeError = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          error.response?.data?.message ||
                          (error.response?.status === 401 
                            ? "Sesión expirada. Por favor, inicia sesión nuevamente." 
                            : "Error al crear backup");
      mostrarNotificacion(mensajeError, "error");
      
      // Si es error de autenticación, no cerrar el modal para que el usuario pueda intentar nuevamente después de iniciar sesión
      if (error.response?.status !== 401) {
        setShowModal(false);
      }
    }
  };

  const handleRestoreConfirm = async () => {
    if (!backupToRestore) return;

    try {
      await restoreBackup(backupToRestore.id);
      mostrarNotificacion(`Restauración del backup "${backupToRestore.nombre}" iniciada exitosamente.`);
      setShowConfirmRestore(false);
      setBackupToRestore(null);
      
      // Actualizar la lista varias veces para ver el cambio de estado
      // Primero inmediatamente, luego después de unos segundos cuando termine la restauración
      cargarBackups();
      cargarEstadisticas();
      
      // Actualizar periódicamente para ver cuando cambia a "restaurado"
      const intervalo = setInterval(() => {
        cargarBackups();
        cargarEstadisticas();
      }, 3000); // Cada 3 segundos
      
      // Detener después de 30 segundos
      setTimeout(() => {
        clearInterval(intervalo);
        cargarBackups();
        cargarEstadisticas();
      }, 30000);
    } catch (error) {
      console.error("Error al restaurar backup:", error);
      const mensajeError = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          "Error al restaurar backup";
      mostrarNotificacion(mensajeError, "error");
    }
  };

  const handleEjecutarAutomatico = async () => {
    try {
      await ejecutarBackupAutomatico();
      mostrarNotificacion("Backup automático iniciado exitosamente.");
      setTimeout(cargarBackups, 2000);
      setTimeout(cargarEstadisticas, 2000);
    } catch (error) {
      mostrarNotificacion("Error al ejecutar backup automático", "error");
    }
  };

  const getEstadoBadge = (backup) => {
    // Si tiene estado_display, usarlo (para restaurado/restaurando)
    const estado = backup.estado_display || backup.estado;
    
    const badges = {
      completado: "bg-green-100 text-green-800",
      fallido: "bg-red-100 text-red-800",
      en_proceso: "bg-yellow-100 text-yellow-800",
      restaurado: "bg-blue-100 text-blue-800",
      restaurando: "bg-purple-100 text-purple-800",
    };
    return badges[estado] || "bg-gray-100 text-gray-800";
  };
  
  const getEstadoTexto = (backup) => {
    const estado = backup.estado_display || backup.estado;
    
    const textos = {
      completado: "✓ Completado",
      fallido: "✗ Fallido",
      en_proceso: "⏳ En Proceso",
      restaurado: "🔄 Restaurado",
      restaurando: "⏳ Restaurando",
    };
    return textos[estado] || estado;
  };

  const getTipoBadge = (tipo) => {
    return tipo === "manual" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-purple-100 text-purple-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Cargando backups...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {notification.show && (
        <SuccessNotification 
          message={notification.message} 
          type={notification.type} 
        />
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Backups</div>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.total_backups}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Completados</div>
            <div className="text-2xl font-bold text-green-600">{estadisticas.completados}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Fallidos</div>
            <div className="text-2xl font-bold text-red-600">{estadisticas.fallidos}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Tamaño Total</div>
            <div className="text-2xl font-bold text-purple-600">{estadisticas.tamanio_total_mb} MB</div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Crear Backup Manual
        </button>
        <button
          onClick={handleEjecutarAutomatico}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition relative flex items-center gap-2"
        >
          <span>🤖 Ejecutar Backup Automático</span>
          <span className="ml-2 text-sm bg-purple-800 px-2 py-1 rounded flex items-center gap-1">
            🕐 Próximo: {String(tiempoRestante.horas).padStart(2, '0')}:{String(tiempoRestante.minutos).padStart(2, '0')}:{String(tiempoRestante.segundos).padStart(2, '0')}
          </span>
        </button>
        <button
          onClick={async () => {
            try {
              setLoading(true);
              await Promise.all([
                cargarBackups(false), // No mostrar loading individual
                cargarEstadisticas()
              ]);
              mostrarNotificacion("Backups actualizados correctamente", "success");
            } catch (error) {
              console.error("Error al actualizar:", error);
              // El error ya se muestra en cargarBackups o cargarEstadisticas
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "🔄 Actualizando..." : "🔄 Actualizar"}
        </button>
      </div>

      {/* Tabla de backups */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Backups</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tamaño</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Creado por</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No hay backups disponibles
                  </td>
                </tr>
              ) : (
              backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{backup.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{backup.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoBadge(backup.tipo)}`}>
                      {backup.tipo === "manual" ? "📝 Manual" : "🤖 Automático"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(backup)}`}>
                      {getEstadoTexto(backup)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{backup.tamanio_mb || 0} MB</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{backup.creado_por_username || "Sistema"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {backup.fecha_creacion ? new Date(backup.fecha_creacion).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* Verificar si el backup está completado o tiene estado original completado */}
                    {(backup.estado === "completado" || backup.estado_original === "completado") && 
                     backup.estado_display !== "restaurando" ? (
                      <button
                        onClick={() => {
                          setBackupToRestore(backup);
                          setShowConfirmRestore(true);
                        }}
                        className="px-3 py-1 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                      >
                        {backup.estado_display === "restaurado" ? "🔄 Restaurar Nuevamente" : "🔄 Restaurar"}
                      </button>
                    ) : backup.estado_display === "restaurando" ? (
                      <span className="px-3 py-1 rounded text-sm font-medium bg-purple-600 text-white">
                        ⏳ Restaurando...
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed">
                        🔄 Restaurar
                      </span>
                    )}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear backup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Crear Backup Manual</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Backup</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Backup antes de actualizar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  placeholder="Descripción del backup"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearBackup}
                disabled={!formData.nombre}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para restaurar */}
      {showConfirmRestore && backupToRestore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">¿Confirmar Restauración?</h3>
            <p className="mb-4 text-gray-600">
              Estás a punto de restaurar el backup: <strong>{backupToRestore.nombre}</strong>
            </p>
            <p className="mb-4 text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
              ⚠️ Esta acción restaurará el sistema a este punto. Se creará un backup de seguridad del estado actual.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConfirmRestore(false);
                  setBackupToRestore(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestoreConfirm}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmar Restauración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupList;
