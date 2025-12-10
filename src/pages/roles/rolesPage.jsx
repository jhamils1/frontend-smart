import React, { useEffect, useState } from "react";
import RolesList from "./rolesList.jsx";
import RolesForm from "./rolesForm.jsx";
import {
	getRoles,
	createRole,
	updateRole,
	deleteRole,
} from "../../api/rolesApi.jsx";
import Sidebar from "../../components/sidebar.jsx";
import { getPermissions } from "../../api/rolesApi.jsx";

const RolesPage = () => {
	const [roles, setRoles] = useState([]);
	const [permisos, setPermisos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(null);
	const [showForm, setShowForm] = useState(false);

	async function loadRoles() {
		setLoading(true);
		try {
			const data = await getRoles();
			setRoles(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error("Error al cargar roles:", e);
			if (e.response?.status === 401) {
				alert("Error al cargar roles: Sesión expirada. Por favor, inicia sesión nuevamente.");
				// Opcional: redirigir al login
				// window.location.href = '/login';
			} else {
				alert("Error al cargar roles");
			}
		} finally {
			setLoading(false);
		}
	}

	async function loadPermisos() {
		try {
			const data = await getPermissions();
			setPermisos(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error("Error al cargar permisos:", e);
			if (e.response?.status === 401) {
				console.warn("No se pueden cargar permisos: sesión no autenticada");
			}
			setPermisos([]);
		}
	}

	useEffect(() => {
		loadRoles();
		loadPermisos();
	}, []);

	const handleEdit = (row) => {
		setEditing(row);
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		if (!window.confirm("¿Seguro que quieres eliminar este rol?")) return;
		try {
			await deleteRole(id);
			alert("Rol eliminado correctamente");
			loadRoles();
		} catch (e) {
			console.error("Error al eliminar:", e);
			alert("Error al eliminar rol");
		}
	};

	const handleFormSubmit = async (formData) => {
		try {
			if (editing) {
				await updateRole(editing.id, formData);
				alert("Rol actualizado correctamente");
			} else {
				await createRole(formData);
				alert("Rol creado correctamente");
			}
			setShowForm(false);
			setEditing(null);
			loadRoles();
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
					<h1 className="text-3xl font-bold text-gray-800">Roles</h1>
				</header>
				<div className="p-6">
					<RolesList
						roles={roles}
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
								<RolesForm
									onSubmit={handleFormSubmit}
									onCancel={() => {
										setShowForm(false);
										setEditing(null);
									}}
									initialData={editing}
									permisos={permisos}
									loading={loading}
								/>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default RolesPage;
