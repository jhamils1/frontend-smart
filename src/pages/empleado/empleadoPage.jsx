import React, { useEffect, useState } from "react";
import EmpleadoList from "./empleadoList.jsx";
import EmpleadoForm from "./empeladoForm.jsx";
import {
	getEmpleados,
	createEmpleado,
	updateEmpleado,
	deleteEmpleado,
} from "../../api/empleadoApi.jsx";
import { getUsuarios } from "../../api/usersApi.jsx";
import Sidebar from "../../components/sidebar.jsx";

const EmpleadoPage = () => {
	const [empleados, setEmpleados] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(null);
	const [showForm, setShowForm] = useState(false);

	async function loadEmpleados() {
		setLoading(true);
		try {
			const data = await getEmpleados();
			setEmpleados(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error("Error al cargar empleados:", e);
			alert("Error al cargar empleados");
		} finally {
			setLoading(false);
		}
	}

	async function loadUsuarios() {
		try {
			const data = await getUsuarios();
			setUsuarios(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error("Error al cargar usuarios:", e);
			setUsuarios([]);
		}
	}

	useEffect(() => {
		loadEmpleados();
		loadUsuarios();
	}, []);

	const handleEdit = (row) => {
		setEditing(row);
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("¿Seguro que quieres eliminar este empleado?")) return;
		try {
			await deleteEmpleado(id);
			alert("Empleado eliminado correctamente");
			loadEmpleados();
		} catch (e) {
			console.error("Error al eliminar:", e);
			alert("Error al eliminar empleado");
		}
	};

	const handleFormSubmit = async (formData) => {
		try {
			if (editing) {
				await updateEmpleado(editing.id, formData);
				alert("Empleado actualizado correctamente");
			} else {
				await createEmpleado(formData);
				alert("Empleado creado correctamente");
			}
			setShowForm(false);
			setEditing(null);
			loadEmpleados();
		} catch (e) {
			console.error("Error:", e);
			alert("Error: " + e.message);
		}
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />
			<main className="flex-1 overflow-y-auto">
				<header className="bg-white shadow-sm p-6">
					<h1 className="text-3xl font-bold text-gray-800">Empleados</h1>
				</header>
				<div className="p-6">
					<EmpleadoList
						empleados={empleados}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onAddNew={() => {
							setEditing(null);
							setShowForm(true);
						}}
					/>

					{showForm && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
							<div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
								<EmpleadoForm
									onSubmit={handleFormSubmit}
									onCancel={() => {
										setShowForm(false);
										setEditing(null);
									}}
									initialData={editing}
									loading={loading}
									usuarios={usuarios}
								/>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default EmpleadoPage;
