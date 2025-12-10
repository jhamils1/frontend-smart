
import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
	username: "",
	email: "",
	password: "",
	is_active: true,
	groups: [],
};

const UserForm = ({ onSubmit, onCancel, initialData = {}, loading, roles = [] }) => {
	const [form, setForm] = useState(initialState);

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				username: initialData.username || "",
				email: initialData.email || "",
				password: "", // Nunca mostrar el password actual
				is_active: initialData.is_active !== undefined ? initialData.is_active : true,
				groups: initialData.groups || [],
			});
		} else {
			setForm(initialState);
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (name === "groups") {
			// Para el select de roles, convertir el valor a array con un solo elemento
			setForm((prev) => ({ ...prev, groups: value ? [parseInt(value)] : [] }));
		} else {
			setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form className="bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
			<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
				{initialData && initialData.id ? "Editar Usuario" : "Crear Usuario"}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Usuario</label>
					<input
						name="username"
						value={form.username}
						onChange={handleChange}
						required
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
					<input
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						required
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Contraseña</label>
					<input
						name="password"
						type="password"
						value={form.password}
						onChange={handleChange}
						placeholder={initialData && initialData.id ? "Dejar vacío para no cambiar" : ""}
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Rol</label>
					<select
						name="groups"
						value={form.groups && form.groups.length > 0 ? form.groups[0] : ""}
						onChange={handleChange}
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						<option value="">Sin rol asignado</option>
						{roles.map((rol) => (
							<option key={rol.id} value={rol.id}>
								{rol.name}
							</option>
						))}
					</select>
				</div>
				<div className="flex items-center mt-6">
					<input
						name="is_active"
						type="checkbox"
						checked={form.is_active}
						onChange={handleChange}
						className="mr-2"
					/>
					<label className="text-sm font-medium text-gray-700">Activo</label>
				</div>
			</div>
			<div className="flex justify-end mt-8">
				<Button variant="guardar" type="submit" disabled={loading}>
					{initialData && initialData.id ? "Guardar Cambios" : "Crear"}
				</Button>
				<Button variant="cancelar" type="button" onClick={onCancel} className="ml-4">
					Cancelar
				</Button>
			</div>
		</form>
	);
};

export default UserForm;
