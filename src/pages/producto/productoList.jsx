import React, { useMemo, useState } from "react";
import Button from "../../components/button.jsx";

const ProductoList = ({ productos, onEdit, onDelete, onAddNew }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filtered = useMemo(() => {
		if (!productos || !Array.isArray(productos)) return [];
		if (!searchTerm) return productos;
		const s = searchTerm.toLowerCase();
		return productos.filter((p) => {
			return (
				(p.codigo && p.codigo.toLowerCase().includes(s)) ||
				(p.nombre && p.nombre.toLowerCase().includes(s)) ||
				(p.descripcion && p.descripcion.toLowerCase().includes(s)) ||
				(p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(s))
			);
		});
	}, [searchTerm, productos]);

	const formatPrice = (price) => {
		return `Bs. ${parseFloat(price).toFixed(2)}`;
	};

	const getStockStatus = (stock) => {
		if (stock === 0) return { text: "Agotado", color: "bg-red-100 text-red-800" };
		if (stock < 10) return { text: "Bajo", color: "bg-yellow-100 text-yellow-800" };
		return { text: "Disponible", color: "bg-green-100 text-green-800" };
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Catálogo de Productos
			</h2>

			<div className="flex justify-between items-center mb-4">
				<Button variant="guardar" onClick={onAddNew}>
					Nuevo Producto
				</Button>
				<div className="flex justify-end flex-1 ml-8">
					<input
						type="text"
						placeholder="Buscar por código, nombre o categoría"
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
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Código</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Imagen</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Nombre</th>
							<th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase border-b">Categoría</th>
							<th className="py-3 px-6 text-right text-sm font-semibold text-gray-700 uppercase border-b">P. Compra</th>
							<th className="py-3 px-6 text-right text-sm font-semibold text-gray-700 uppercase border-b">P. Venta</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Stock</th>
							<th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 uppercase border-b">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filtered.map((p) => {
							const stockStatus = getStockStatus(p.stock);
							return (
								<tr key={p.id} className="hover:bg-gray-50 transition-colors">
									<td className="py-3 px-6 text-sm font-medium text-gray-900">{p.codigo}</td>
									<td className="py-3 px-6">
										{p.imagen ? (
											<img 
												src={p.imagen} 
												alt={p.nombre} 
												className="w-16 h-16 object-cover rounded border"
												onError={(e) => {
													e.target.src = "https://via.placeholder.com/64?text=Sin+Imagen";
												}}
											/>
										) : (
											<div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
												<span className="text-xs text-gray-400">Sin imagen</span>
											</div>
										)}
									</td>
									<td className="py-3 px-6 text-sm text-gray-900">{p.nombre}</td>
									<td className="py-3 px-6 text-sm text-gray-600">
										{p.categoria_nombre || <span className="text-gray-400 italic">Sin categoría</span>}
									</td>
									<td className="py-3 px-6 text-sm text-right text-gray-900">{formatPrice(p.precio_compra)}</td>
									<td className="py-3 px-6 text-sm text-right font-semibold text-gray-900">{formatPrice(p.precio_venta)}</td>
									<td className="py-3 px-6 text-center">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
											{p.stock} - {stockStatus.text}
										</span>
									</td>
									<td className="py-3 px-6 text-center">
										<div className="flex justify-center gap-2">
											<Button variant="editar" onClick={() => onEdit(p)}>
												Editar
											</Button>
											<Button variant="eliminar" onClick={() => onDelete(p.id)}>
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
					{searchTerm ? "No se encontraron productos con ese criterio" : "No hay productos registrados"}
				</div>
			)}
		</div>
	);
};

export default ProductoList;
