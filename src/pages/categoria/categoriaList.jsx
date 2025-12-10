import React, { useMemo, useState } from "react";
import Button from "../../components/button.jsx";

const CategoriaList = ({ categorias, onEdit, onDelete, onAddNew }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!categorias || !Array.isArray(categorias)) return [];
		if (!searchTerm) return categorias;
		const s = searchTerm.toLowerCase();
		return categorias.filter((c) => {
			return (
				(c.nombre && c.nombre.toLowerCase().includes(s)) ||
				(c.descripcion && c.descripcion.toLowerCase().includes(s))
			);
		});
	}, [searchTerm, categorias]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Listado de Categorías
			</h2>

			<div className="flex justify-between items-center mb-4">
				<Button variant="guardar" onClick={onAddNew}>
					Nueva Categoría
				</Button>
				<div className="flex justify-end flex-1 ml-8">
					<input
						type="text"
						placeholder="Buscar por nombre o descripción"
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
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Nombre</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Descripción</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((c) => (
							<tr key={c.id} className="hover:bg-gray-50 transition-colors">
								<td className="py-3 px-6 text-sm text-gray-900">{c.id}</td>
								<td className="py-3 px-6 text-sm font-medium text-gray-900">{c.nombre}</td>
								<td className="py-3 px-6 text-sm text-gray-600">
									{c.descripcion || <span className="text-gray-400 italic">Sin descripción</span>}
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
					{searchTerm ? "No se encontraron categorías con ese criterio" : "No hay categorías registradas"}
				</div>
			)}
		</div>
	);
};

export default CategoriaList;
