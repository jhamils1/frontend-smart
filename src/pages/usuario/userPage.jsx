
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar.jsx";
import {
	getUsuarios,
	getUsuario,
	createUsuario,
	updateUsuario,
	deleteUsuario,
} from "../../api/usersApi.jsx";
import { getRoles } from "../../api/rolesApi.jsx";
import UserList from "./userList.jsx";
import UserForm from "./userForm.jsx";

const UserPage = () => {
	const [usuarios, setUsuarios] = useState([]);
	const [roles, setRoles] = useState([]);
	const [selected, setSelected] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);

	const fetchUsuarios = async () => {
		setLoading(true);
		try {
			const data = await getUsuarios();
			setUsuarios(data);
		} catch (err) {
			console.error("Error al cargar usuarios:", err);
		}
		setLoading(false);
	};

	const fetchRoles = async () => {
		try {
			const data = await getRoles();
			setRoles(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Error al cargar roles:", err);
			setRoles([]);
		}
	};

	useEffect(() => {
		fetchUsuarios();
		fetchRoles();
	}, []);

	const handleAddNew = () => {
		setSelected(null);
		setShowForm(true);
	};

	const handleEdit = (usuario) => {
		setSelected(usuario);
		setShowForm(true);
	};

	const handleDelete = async (usuario) => {
		if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
			setLoading(true);
			await deleteUsuario(usuario.id);
			await fetchUsuarios();
			setLoading(false);
		}
	};

	const handleSubmit = async (form) => {
		setLoading(true);
		try {
			if (selected && selected.id) {
				// Si el campo password está vacío, no lo envíes
				const { password, ...rest } = form;
				const data = password ? form : rest;
				await updateUsuario(selected.id, data);
			} else {
				await createUsuario(form);
			}
			await fetchUsuarios();
			setShowForm(false);
			setSelected(null);
		} catch (err) {
			// Manejo de error
		}
		setLoading(false);
	};

	const handleCancel = () => {
		setShowForm(false);
		setSelected(null);
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar />
			<main className="flex-1 overflow-y-auto">
				<header className="bg-white shadow-sm p-6">
					<h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
				</header>
				<div className="p-6">
					<UserList
						usuarios={usuarios}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onAddNew={handleAddNew}
					/>

					{showForm && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
							<div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
								<UserForm
									onSubmit={handleSubmit}
									onCancel={handleCancel}
									initialData={selected}
									loading={loading}
									roles={roles}
								/>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default UserPage;
