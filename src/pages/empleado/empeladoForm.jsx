import React, { useState } from "react";

const initialState = {
	nombre: "",
	apellido: "",
	ci: "",
	telefono: "",
	sexo: "M",
	direccion: "",
	estado: "Activo",
	fecha_nacimiento: "",
	cargo: "GESTOR_PEDIDOS",
	sueldo: "",
	usuario: "",
};

const cargoOptions = [
	{ value: "GESTOR_PEDIDOS", label: "Gestor de Pedidos" },
	{ value: "ANALISTA_NEGOCIO", label: "Analista de Negocio" },
];

const sexoOptions = [
	{ value: "M", label: "Masculino" },
	{ value: "F", label: "Femenino" },
];

const estadoOptions = [
	{ value: "Activo", label: "Activo" },
	{ value: "Inactivo", label: "Inactivo" },
];


const EmpleadoForm = ({ initialData, onSubmit, onCancel, loading, usuarios = [] }) => {
	const [form, setForm] = useState(initialState);

	React.useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				nombre: initialData.nombre || "",
				apellido: initialData.apellido || "",
				ci: initialData.ci || "",
				telefono: initialData.telefono || "",
				sexo: initialData.sexo || "M",
				direccion: initialData.direccion || "",
				estado: initialData.estado || "Activo",
				fecha_nacimiento: initialData.fecha_nacimiento || "",
				cargo: initialData.cargo || "GESTOR_PEDIDOS",
				sueldo: initialData.sueldo || "",
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
		// Convertir campos vacíos a null antes de enviar
		const formData = {
			...form,
			usuario: form.usuario === "" ? null : form.usuario,
			ci: form.ci === "" ? null : form.ci,
			telefono: form.telefono === "" ? null : form.telefono,
			apellido: form.apellido === "" ? null : form.apellido,
			sueldo: form.sueldo === "" ? null : form.sueldo,
			fecha_nacimiento: form.fecha_nacimiento === "" ? null : form.fecha_nacimiento,
		};
		if (onSubmit) onSubmit(formData);
	};

	return (
		<form className="bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
			<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
				{initialData && initialData.id ? "Editar Empleado" : "Registrar Empleado"}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Nombre</label>
					<input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Apellido</label>
					<input name="apellido" value={form.apellido} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">CI</label>
					<input name="ci" value={form.ci} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Teléfono</label>
					<input name="telefono" value={form.telefono} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Dirección</label>
					<input name="direccion" value={form.direccion} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Sexo</label>
					<select name="sexo" value={form.sexo} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg">
						{sexoOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Estado</label>
					<select name="estado" value={form.estado} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg">
						{estadoOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Cargo</label>
					<select name="cargo" value={form.cargo} onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 rounded-lg">
						{cargoOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Sueldo</label>
					<input name="sueldo" value={form.sueldo} onChange={handleChange} type="number" className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">Fecha de Nacimiento</label>
					<input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} type="date" className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
				</div>
			</div>
			<div className="mt-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">Usuario Asociado</label>
				<select 
					name="usuario" 
					value={form.usuario} 
					onChange={handleChange}
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
			<div className="flex gap-4 mt-8 justify-end">
				<button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-lg" onClick={onCancel}>
					Cancelar
				</button>
				<button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg" disabled={loading}>
					{loading ? "Guardando..." : "Guardar"}
				</button>
			</div>
		</form>
	);
};

export default EmpleadoForm;
