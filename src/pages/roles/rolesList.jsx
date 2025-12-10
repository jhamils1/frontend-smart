import React, { useMemo, useState } from "react";
import Button from "../../components/button.jsx";

const RolesList = ({ roles, onEdit, onDelete, onAddNew }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!roles || !Array.isArray(roles)) return [];
		if (!searchTerm) return roles;
		const s = searchTerm.toLowerCase();
		return roles.filter((r) => r.name && r.name.toLowerCase().includes(s));
	}, [searchTerm, roles]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Listado de Roles
			</h2>

			<div className="flex justify-between items-center mb-4">
				<Button variant="guardar" onClick={onAddNew}>
					Nuevo Rol
				</Button>
				<div className="flex justify-end flex-1 ml-8">
					<input
						type="text"
						placeholder="Buscar por nombre de rol"
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
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Permisos</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((r) => (
							<tr key={r.id} className="hover:bg-gray-50 transition-colors">
								<td className="py-3 px-6 text-sm text-gray-900">{r.name}</td>
								<td className="py-3 px-6 text-sm text-gray-900">
									{r.permissions && r.permissions.length > 0 ? (
										<ul className="list-disc ml-4">
											{r.permissions.map((p) => (
												<li key={p.id} className="text-xs text-gray-700">{p.name}</li>
											))}
										</ul>
									) : (
										<span className="text-xs text-gray-400">Sin permisos</span>
									)}
								</td>
								<td className="py-3 px-6 text-center">
									<div className="flex justify-center gap-2">
										<Button variant="editar" onClick={() => onEdit(r)}>
											Editar
										</Button>
										<Button variant="eliminar" onClick={() => onDelete(r.id)}>
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
					No se encontraron roles
				</div>
			)}
		</div>
	);
};

export default RolesList;
