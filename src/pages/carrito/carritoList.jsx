import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button.jsx";

const CarritoList = ({ carritos, onEdit, onDelete, onAddNew }) => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!carritos || !Array.isArray(carritos)) return [];
		if (!searchTerm) return carritos;
		const s = searchTerm.toLowerCase();
		return carritos.filter((c) => {
			return (
				(c.cliente_nombre && c.cliente_nombre.toLowerCase().includes(s)) ||
				(c.codigo && c.codigo.toLowerCase().includes(s)) ||
				(c.id && String(c.id).includes(s))
			);
		});
	}, [searchTerm, carritos]);

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
			activo: "bg-blue-100 text-blue-800",
			completado: "bg-green-100 text-green-800",
			abandonado: "bg-red-100 text-red-800"
		};
		const labels = {
			activo: "Activo",
			completado: "Completado",
			abandonado: "Abandonado"
		};
		return { class: badges[estado] || "bg-gray-100 text-gray-800", label: labels[estado] || estado };
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Listado de Carritos
			</h2>

			<div className="flex justify-between items-center mb-4">
				<Button variant="guardar" onClick={onAddNew}>
					Nuevo Carrito
				</Button>
				<div className="flex justify-end flex-1 ml-8">
					<input
						type="text"
						placeholder="Buscar por cliente, código o ID"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 w-80 focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200 rounded-lg">
					<thead className="bg-gray-50">
						<tr>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">ID</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Código</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Cliente</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Fecha Creación</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Items</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Total</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Estado</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((c) => {
							const estadoBadge = getEstadoBadge(c.estado);
							return (
								<tr key={c.id} className="hover:bg-gray-50 transition-colors">
									<td className="py-3 px-6 text-sm text-gray-900">#{c.id}</td>
									<td className="py-3 px-6 text-sm text-gray-900 font-mono">{c.codigo}</td>
									<td className="py-3 px-6 text-sm text-gray-900">
										{c.cliente_nombre || "N/A"}
									</td>
									<td className="py-3 px-6 text-sm text-gray-900">{formatDate(c.fecha_creacion)}</td>
									<td className="py-3 px-6 text-sm text-gray-900">
										<span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
											{c.total_items || 0} items
										</span>
									</td>
									<td className="py-3 px-6 text-sm text-gray-900 font-semibold">
										Bs. {parseFloat(c.total_carrito || 0).toFixed(2)}
									</td>
									<td className="py-3 px-6 text-sm">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge.class}`}>
											{estadoBadge.label}
										</span>
									</td>
									<td className="py-3 px-6 text-center">
										<div className="flex justify-center gap-2">
											<button
												onClick={() => navigate("/detallecarrito", { state: { carrito: c } })}
												className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
											>
												Ver Detalles
											</button>
											<Button variant="editar" onClick={() => onEdit(c)}>
												Editar
											</Button>
											<Button variant="eliminar" onClick={() => onDelete(c.id)}>
												Eliminar
											</Button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{filtered.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					No se encontraron carritos
				</div>
			)}
		</div>
	);
};

export default CarritoList;
