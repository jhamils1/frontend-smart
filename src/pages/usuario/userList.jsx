
import React, { useMemo, useState } from "react";
import Button from "../../components/button.jsx";

const UserList = ({ usuarios, onEdit, onDelete, onAddNew }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!usuarios || !Array.isArray(usuarios)) return [];
		if (!searchTerm) return usuarios;
		const s = searchTerm.toLowerCase();
		return usuarios.filter((u) => {
			return (
				(u.username && u.username.toLowerCase().includes(s)) ||
				(u.email && u.email.toLowerCase().includes(s))
			);
		});
	}, [searchTerm, usuarios]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Listado de Usuarios
			</h2>

			<div className="flex justify-between items-center mb-4">
				<Button variant="guardar" onClick={onAddNew}>
					Nuevo Usuario
				</Button>
				<div className="flex justify-end flex-1 ml-8">
					<input
						type="text"
						placeholder="Buscar por usuario o email"
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
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Username</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Email</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Role</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((u) => (
							<tr key={u.id} className="hover:bg-gray-50 transition-colors">
								<td className="py-3 px-6 text-sm text-gray-900">{u.username}</td>
								<td className="py-3 px-6 text-sm text-gray-900">{u.email}</td>
								<td className="py-3 px-6 text-sm text-gray-900">{u.role || '-'}</td>
								<td className="py-3 px-6 text-center text-sm">
									<Button variant="editar" onClick={() => onEdit(u)}>
										Editar
									</Button>
									<Button variant="eliminar" onClick={() => onDelete(u)} className="ml-2">
										Eliminar
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UserList;
