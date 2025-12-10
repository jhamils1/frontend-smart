import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
	codigo: "",
	cliente: "",
	estado: "activo",
};

const CarritoForm = ({ onSubmit, onCancel, initialData = {}, clientes = [], loading }) => {
	const [form, setForm] = useState(initialState);

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				codigo: initialData.codigo || "",
				cliente: initialData.cliente || "",
				estado: initialData.estado || "activo",
			});
		} else {
			// Generar código automático para nuevo carrito
			const codigoAuto = `CART-${Date.now()}`;
			setForm({ ...initialState, codigo: codigoAuto });
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form className="bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
			<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
				{initialData && initialData.id ? "Editar Carrito" : "Nuevo Carrito"}
			</h2>
			
			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Código del Carrito</label>
					<input 
						type="text"
						name="codigo" 
						value={form.codigo} 
						onChange={handleChange} 
						required
						placeholder="Ej: CART-2025-001"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
					<p className="text-xs text-gray-500 mt-1">
						Código único para identificar el carrito
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Cliente</label>
					<select 
						name="cliente" 
						value={form.cliente} 
						onChange={handleChange} 
						required
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						<option value="">Seleccione un cliente</option>
						{clientes.map((c) => (
							<option key={c.id} value={c.id}>
								{c.nombre} {c.apellido} - CI: {c.ci}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Estado</label>
					<select 
						name="estado" 
						value={form.estado} 
						onChange={handleChange} 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						<option value="activo">Activo</option>
						<option value="completado">Completado</option>
						<option value="abandonado">Abandonado</option>
					</select>
				</div>

				<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
					<p className="text-sm text-blue-800">
						💡 <strong>Nota:</strong> El total se calculará automáticamente al agregar productos en los detalles del carrito.
					</p>
				</div>
			</div>

			<div className="flex justify-end gap-3 mt-8 pt-6 border-t">
				{onCancel && (
					<Button variant="cancelar" onClick={onCancel}>
						Cancelar
					</Button>
				)}
				<Button variant="guardar" type="submit" disabled={loading}>
					{initialData && initialData.id ? "Guardar Cambios" : "Guardar"}
				</Button>
			</div>
		</form>
	);
};

export default CarritoForm;
