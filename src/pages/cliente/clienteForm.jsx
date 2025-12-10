import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
	nombre: "",
	apellido: "",
	ci: "",
	direccion: "",
	estado: "activo",
	sexo: "M",
	telefono: "",
	usuario: "",
};

const ClienteForm = ({ onSubmit, onCancel, initialData = {}, usuarios = [], loading }) => {
	const [form, setForm] = useState(initialState);

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				nombre: initialData.nombre || "",
				apellido: initialData.apellido || "",
				ci: initialData.ci || "",
				direccion: initialData.direccion || "",
				estado: initialData.estado || "activo",
				sexo: initialData.sexo || "M",
				telefono: initialData.telefono || "",
				usuario: initialData.usuario || "",
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
				{initialData && initialData.id ? "Editar Cliente" : "Registrar Cliente"}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Nombre</label>
					<input 
						name="nombre" 
						value={form.nombre} 
						onChange={handleChange} 
						required 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Apellido</label>
					<input 
						name="apellido" 
						value={form.apellido} 
						onChange={handleChange} 
						required 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">CI</label>
					<input 
						name="ci" 
						value={form.ci} 
						onChange={handleChange} 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Teléfono</label>
					<input 
						name="telefono" 
						value={form.telefono} 
						onChange={handleChange} 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>
			</div>
			<div className="mt-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">Dirección</label>
				<input 
					name="direccion" 
					value={form.direccion} 
					onChange={handleChange} 
					className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Sexo</label>
					<select 
						name="sexo" 
						value={form.sexo} 
						onChange={handleChange} 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						<option value="M">Masculino</option>
						<option value="F">Femenino</option>
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
						<option value="inactivo">Inactivo</option>
					</select>
				</div>
			</div>
			<div className="mt-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">Usuario Asociado</label>
				<select 
					name="usuario" 
					value={form.usuario} 
					onChange={handleChange} 
					required
					className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				>
					<option value="">Seleccione un usuario</option>
					{usuarios.map((u) => (
						<option key={u.id} value={u.id}>{u.username} ({u.email})</option>
					))}
				</select>
				<p className="text-xs text-gray-500 mt-1">
					⚠️ Primero debe crear el usuario en la sección de Usuarios, luego podrá asignarlo aquí.
				</p>
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

export default ClienteForm;
