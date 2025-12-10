import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
	name: "",
	permission_ids: [],
};

const RolesForm = ({ onSubmit, onCancel, initialData = {}, permisos = [], loading }) => {
	const [form, setForm] = useState(initialState);

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				name: initialData.name || "",
				permission_ids: initialData.permissions ? initialData.permissions.map(p => p.id) : [],
			});
		} else {
			setForm(initialState);
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handlePermissionsChange = (e) => {
		const options = e.target.options;
		const values = [];
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				values.push(Number(options[i].value));
			}
		}
		setForm((prev) => ({ ...prev, permission_ids: values }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form className="bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
			<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
				{initialData && initialData.id ? "Editar Rol" : "Registrar Rol"}
			</h2>
			<div className="grid grid-cols-1 gap-6">
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Nombre del Rol</label>
					<input
						name="name"
						value={form.name}
						onChange={handleChange}
						required
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Permisos</label>
					<div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ccc", padding: 8 }}>
						{permisos.map((p) => (
							<div key={p.id}>
								<label>
									<input
										type="checkbox"
										value={p.id}
										checked={form.permission_ids.includes(p.id)}
										onChange={() => {
											setForm((prev) => ({
												...prev,
												permission_ids: prev.permission_ids.includes(p.id)
													? prev.permission_ids.filter((pid) => pid !== p.id)
													: [...prev.permission_ids, p.id],
											}));
										}}
									/>
									{` ${p.name} (${p.codename})`}
								</label>
							</div>
						))}
					</div>
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

export default RolesForm;
