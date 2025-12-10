import React, { useMemo, useState } from "react";
import Button from "../../components/button.jsx";

const ClienteList = ({ clientes, onEdit, onDelete, onAddNew }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!clientes || !Array.isArray(clientes)) return [];
		if (!searchTerm) return clientes;
		const s = searchTerm.toLowerCase();
		return clientes.filter((c) => {
			return (
				(c.nombre && c.nombre.toLowerCase().includes(s)) ||
				(c.apellido && c.apellido.toLowerCase().includes(s)) ||
				(c.ci && String(c.ci).toLowerCase().includes(s)) ||
				(c.telefono && String(c.telefono).toLowerCase().includes(s))
			);
		});
	}, [searchTerm, clientes]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Listado de Clientes
			</h2>

			<div className="flex justify-between items-center mb-4">
				<Button variant="guardar" onClick={onAddNew}>
					Nuevo Cliente
				</Button>
				<div className="flex justify-end flex-1 ml-8">
					<input
						type="text"
						placeholder="Buscar por nombre, apellido o CI"
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
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Nombre</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Apellido</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">CI</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Teléfono</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Usuario</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Estado</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((c) => (
							<tr key={c.id} className="hover:bg-gray-50 transition-colors">
								<td className="py-3 px-6 text-sm text-gray-900">{c.nombre}</td>
								<td className="py-3 px-6 text-sm text-gray-900">{c.apellido}</td>
								<td className="py-3 px-6 text-sm text-gray-900">{c.ci || "N/A"}</td>
								<td className="py-3 px-6 text-sm text-gray-900">{c.telefono || "N/A"}</td>
								<td className="py-3 px-6 text-sm text-gray-900">
									{c.usuario_info ? c.usuario_info.username : "-"}
								</td>
								<td className="py-3 px-6 text-sm">
									<span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
										{c.estado === "activo" ? "Activo" : "Inactivo"}
									</span>
								</td>
								<td className="py-3 px-6 text-center">
									<div className="flex justify-center gap-2">
										<Button variant="editar" onClick={() => onEdit(c)}>
											Editar
										</Button>
										<Button variant="eliminar" onClick={() => onDelete(c.id)}>
											Eliminar
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{filtered.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					No se encontraron clientes
				</div>
			)}
		</div>
	);
};

export default ClienteList;
