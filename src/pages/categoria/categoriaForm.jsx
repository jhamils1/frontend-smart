import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
	nombre: "",
	descripcion: "",
};

const CategoriaForm = ({ onSubmit, onCancel, initialData = {}, loading }) => {
	const [form, setForm] = useState(initialState);

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				nombre: initialData.nombre || "",
				descripcion: initialData.descripcion || "",
			});
		} else {
			setForm(initialState);
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
				{initialData && initialData.id ? "Editar Categoría" : "Registrar Categoría"}
			</h2>
			
			<div className="mb-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">
					Nombre <span className="text-red-500">*</span>
				</label>
				<input 
					name="nombre" 
					value={form.nombre} 
					onChange={handleChange} 
					required 
					placeholder="Ingrese el nombre de la categoría"
					className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
				/>
			</div>

			<div className="mb-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">
					Descripción
				</label>
				<textarea 
					name="descripcion" 
					value={form.descripcion} 
					onChange={handleChange} 
					placeholder="Ingrese una descripción (opcional)"
					rows="4"
					className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" 
				/>
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

export default CategoriaForm;
