import React, { useEffect, useState } from "react";
import { getPagos } from "../../api/pagoApi.jsx";
import Sidebar from "../../components/sidebar.jsx";
import Button from "../../components/button.jsx";

const PagoList = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadPagos() {
    setLoading(true);
    try {
      const data = await getPagos();
      setPagos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error al cargar pagos:", e);
      alert("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPagos();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: "bg-yellow-100 text-yellow-800",
      completado: "bg-green-100 text-green-800",
      fallido: "bg-red-100 text-red-800",
      reembolsado: "bg-blue-100 text-blue-800"
    };
    const labels = {
      pendiente: "Pendiente",
      completado: "Completado",
      fallido: "Fallido",
      reembolsado: "Reembolsado"
    };
    return { 
      class: badges[estado] || "bg-gray-100 text-gray-800", 
      label: labels[estado] || estado 
    };
  };

  const getMetodoBadge = (metodo) => {
    const badges = {
      tarjeta: "bg-purple-100 text-purple-800",
      efectivo: "bg-green-100 text-green-800",
      transferencia: "bg-blue-100 text-blue-800"
    };
    const labels = {
      tarjeta: "💳 Tarjeta",
      efectivo: "💵 Efectivo",
      transferencia: "🏦 Transferencia"
    };
    return { 
      class: badges[metodo] || "bg-gray-100 text-gray-800", 
      label: labels[metodo] || metodo 
    };
  };

  const filteredPagos = pagos.filter((p) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      (p.factura_codigo && p.factura_codigo.toLowerCase().includes(s)) ||
      (p.id && String(p.id).includes(s)) ||
      (p.metodo_pago && p.metodo_pago.toLowerCase().includes(s))
    );
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800">💰 Historial de Pagos</h1>
        </header>
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Listado de Pagos
            </h2>

            <div className="flex justify-between items-center mb-4">
              <Button variant="guardar" onClick={loadPagos}>
                🔄 Actualizar
              </Button>
              <div className="flex justify-end flex-1 ml-8">
                <input
                  type="text"
                  placeholder="Buscar por factura, ID o método de pago"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 w-80 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando pagos...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">ID</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Factura</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Fecha</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Método</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Monto</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Estado</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Referencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPagos.map((p) => {
                        const estadoBadge = getEstadoBadge(p.estado);
                        const metodoBadge = getMetodoBadge(p.metodo_pago);
                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-6 text-sm text-gray-900">#{p.id}</td>
                            <td className="py-3 px-6 text-sm text-gray-900 font-mono">
                              {p.factura_codigo || `Factura #${p.factura}`}
                            </td>
                            <td className="py-3 px-6 text-sm text-gray-900">{formatDate(p.fecha_pago)}</td>
                            <td className="py-3 px-6 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${metodoBadge.class}`}>
                                {metodoBadge.label}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-sm text-gray-900 font-semibold">
                              Bs. {parseFloat(p.monto || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-6 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge.class}`}>
                                {estadoBadge.label}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-sm text-gray-600 font-mono text-xs">
                              {p.referencia_pago || "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredPagos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron pagos
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoList;
