import React, { useEffect, useState } from "react";
import Button from "../../components/button.jsx";

const initialState = {
	codigo: "",
	nombre: "",
	descripcion: "",
	precio_compra: "",
	precio_venta: "",
	stock: 0,
	imagen: "",
	categoria: "",
};

const ProductoForm = ({ onSubmit, onCancel, initialData = {}, categorias = [], loading }) => {
	const [form, setForm] = useState(initialState);
	const [imagePreview, setImagePreview] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [uploadMode, setUploadMode] = useState("file"); // "file" o "camera"
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const videoRef = React.useRef(null);
	const streamRef = React.useRef(null);

	useEffect(() => {
		if (initialData && Object.keys(initialData).length > 0) {
			setForm({
				codigo: initialData.codigo || "",
				nombre: initialData.nombre || "",
				descripcion: initialData.descripcion || "",
				precio_compra: initialData.precio_compra || "",
				precio_venta: initialData.precio_venta || "",
				stock: initialData.stock || 0,
				imagen: initialData.imagen || "",
				categoria: initialData.categoria || "",
			});
			setImagePreview(initialData.imagen || "");
			setImageFile(null);
		} else {
			setForm(initialState);
			setImagePreview("");
			setImageFile(null);
		}
	}, [initialData]);

	// Limpiar stream de cámara al desmontar
	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validar tipo de archivo
			if (!file.type.startsWith('image/')) {
				alert('Por favor selecciona un archivo de imagen válido');
				return;
			}
			
			// Validar tamaño (máximo 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('La imagen no debe superar los 5MB');
				return;
			}
			
			setImageFile(file);
			// Crear preview local
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
			// Limpiar URL si había
			setForm((prev) => ({ ...prev, imagen: "" }));
		}
	};

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ 
				video: { facingMode: "environment" } // Preferir cámara trasera
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				streamRef.current = stream;
				setIsCameraOpen(true);
			}
		} catch (err) {
			console.error("Error al acceder a la cámara:", err);
			alert("No se pudo acceder a la cámara. Verifica los permisos del navegador.");
		}
	};

	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop());
			streamRef.current = null;
		}
		setIsCameraOpen(false);
	};

	const capturePhoto = () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(videoRef.current, 0, 0);
			
			// Convertir canvas a blob
			canvas.toBlob((blob) => {
				const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
				setImageFile(file);
				setImagePreview(canvas.toDataURL('image/jpeg'));
				stopCamera();
			}, 'image/jpeg', 0.9);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Validar precios
		if (parseFloat(form.precio_venta) < parseFloat(form.precio_compra)) {
			alert("El precio de venta no puede ser menor al precio de compra");
			return;
		}
		
		// Si hay un archivo de imagen, pasarlo junto con el formulario
		onSubmit(form, imageFile);
	};

	return (
		<form className="bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
			<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
				{initialData && initialData.id ? "Editar Producto" : "Registrar Producto"}
			</h2>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Código */}
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">
						Código <span className="text-red-500">*</span>
					</label>
					<input 
						name="codigo" 
						value={form.codigo} 
						onChange={handleChange} 
						required 
						disabled={initialData && initialData.id}
						placeholder="Ej: PROD001"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100" 
					/>
					{initialData && initialData.id && (
						<p className="text-xs text-gray-500 mt-1">El código no se puede modificar</p>
					)}
				</div>

				{/* Nombre */}
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">
						Nombre <span className="text-red-500">*</span>
					</label>
					<input 
						name="nombre" 
						value={form.nombre} 
						onChange={handleChange} 
						required 
						placeholder="Nombre del producto"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>

				{/* Precio Compra */}
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">
						Precio Compra <span className="text-red-500">*</span>
					</label>
					<input 
						name="precio_compra" 
						type="number"
						step="0.01"
						min="0"
						value={form.precio_compra} 
						onChange={handleChange} 
						required 
						placeholder="0.00"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>

				{/* Precio Venta */}
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">
						Precio Venta <span className="text-red-500">*</span>
					</label>
					<input 
						name="precio_venta" 
						type="number"
						step="0.01"
						min="0"
						value={form.precio_venta} 
						onChange={handleChange} 
						required 
						placeholder="0.00"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>

				{/* Stock */}
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">
						Stock <span className="text-red-500">*</span>
					</label>
					<input 
						name="stock" 
						type="number"
						min="0"
						value={form.stock} 
						onChange={handleChange} 
						required 
						placeholder="0"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
					/>
				</div>

				{/* Categoría */}
				<div>
					<label className="block text-sm font-medium mb-2 text-gray-700">
						Categoría
					</label>
					<select 
						name="categoria" 
						value={form.categoria} 
						onChange={handleChange} 
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						<option value="">Sin categoría</option>
						{categorias.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.nombre}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Descripción */}
			<div className="mt-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">
					Descripción
				</label>
				<textarea 
					name="descripcion" 
					value={form.descripcion} 
					onChange={handleChange} 
					placeholder="Descripción del producto (opcional)"
					rows="3"
					className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" 
				/>
			</div>

			{/* Imagen */}
			<div className="mt-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">
					Imagen del Producto
				</label>
				
				{/* Selector de modo */}
				<div className="flex gap-4 mb-4">
					<label className="flex items-center cursor-pointer">
						<input 
							type="radio" 
							checked={uploadMode === "file"}
							onChange={() => {
								setUploadMode("file");
								stopCamera();
								setImagePreview("");
								setImageFile(null);
							}}
							className="mr-2"
						/>
						<span className="text-sm">📁 Subir archivo</span>
					</label>
					<label className="flex items-center cursor-pointer">
						<input 
							type="radio" 
							checked={uploadMode === "camera"}
							onChange={() => {
								setUploadMode("camera");
								setImagePreview("");
								setImageFile(null);
							}}
							className="mr-2"
						/>
						<span className="text-sm">📷 Tomar foto</span>
					</label>
				</div>

				{/* Subida de archivo */}
				{uploadMode === "file" && (
					<div>
						<input 
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
						/>
						<p className="text-xs text-gray-500 mt-1">
							Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB
						</p>
					</div>
				)}

				{/* Cámara */}
				{uploadMode === "camera" && (
					<div className="space-y-3">
						{!isCameraOpen && !imagePreview && (
							<button
								type="button"
								onClick={startCamera}
								className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
							>
								<span className="text-xl">📷</span>
								<span>Abrir Cámara</span>
							</button>
						)}
						
						{isCameraOpen && (
							<div className="space-y-3">
								<div className="relative bg-black rounded-lg overflow-hidden">
									<video 
										ref={videoRef}
										autoPlay
										playsInline
										className="w-full h-64 object-cover"
									/>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={capturePhoto}
										className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
									>
										📸 Capturar Foto
									</button>
									<button
										type="button"
										onClick={stopCamera}
										className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
									>
										❌ Cancelar
									</button>
								</div>
							</div>
						)}
					</div>
				)}
				
				{/* Preview de imagen */}
				{imagePreview && !isCameraOpen && (
					<div className="mt-4 space-y-2">
						<div className="flex justify-center">
							<div className="border border-gray-300 rounded-lg p-2">
								<img 
									src={imagePreview} 
									alt="Preview" 
									className="w-48 h-48 object-cover rounded"
									onError={(e) => {
										e.target.src = "https://via.placeholder.com/150?text=Error";
									}}
								/>
							</div>
						</div>
						<button
							type="button"
							onClick={() => {
								setImagePreview("");
								setImageFile(null);
							}}
							className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition text-sm"
						>
							🗑️ Eliminar imagen y seleccionar otra
						</button>
					</div>
				)}
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

export default ProductoForm;
