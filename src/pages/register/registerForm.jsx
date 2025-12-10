
import React, { useState } from "react";
import logoSmart from "../../assets/logosmart.png";

const RegisterForm = ({ username, email, password, password2, setUsername, setEmail, setPassword, setPassword2, onSubmit, loading, error }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
			<div className="w-full max-w-md">
						<div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
							{/* Header solo con título */}
							<div className="bg-gray-900 px-8 py-10 text-center">
								<h2 className="text-3xl font-bold text-white mb-1">Registro</h2>
							</div>

					{/* Formulario */}
								<div className="px-8 py-8">
									<div className="text-center mb-6">
										<p className="text-gray-300 text-sm">Crea tu cuenta para continuar</p>
									</div>

						<form onSubmit={onSubmit} className="space-y-5">
							{/* Username */}
							<div>
								<label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
									Usuario
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
									<input
										type="text"
										id="username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Ingresa tu usuario"
										required
									/>
								</div>
							</div>

							{/* Email */}
							<div>
								<label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
									Email
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4a4 4 0 01-8 0v-4" />
										</svg>
									</div>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Ingresa tu email"
										required
									/>
								</div>
							</div>

							{/* Password */}
							<div>
								<label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
									Contraseña
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</div>
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Ingresa tu contraseña"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										{showPassword ? (
											<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
											</svg>
										) : (
											<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
							</div>

							{/* Confirm Password */}
							<div>
								<label htmlFor="password2" className="block text-sm font-semibold text-gray-700 mb-2">
									Confirmar Contraseña
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</div>
									<input
										type={showConfirmPassword ? "text" : "password"}
										id="password2"
										value={password2}
										onChange={(e) => setPassword2(e.target.value)}
										className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder="Confirma tu contraseña"
										required
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									>
										{showConfirmPassword ? (
											<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
											</svg>
										) : (
											<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
							</div>

							{/* Mensaje de error */}
							{error && (
								<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
									<div className="flex items-center">
										<svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
										</svg>
										<p className="text-sm text-red-700 font-medium">{error}</p>
									</div>
								</div>
							)}

							{/* Botón de registro */}
							<button
								type="submit"
								disabled={loading}
								className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-lg transform transition-all duration-200 ${
									loading 
										? 'bg-gray-400 cursor-not-allowed' 
										: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
								}`}
							>
								{loading ? (
									<div className="flex items-center justify-center">
										<svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Registrando...
									</div>
								) : (
									<div className="flex items-center justify-center">
										<svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
										</svg>
										Registrarse
									</div>
								)}
							</button>
						</form>

						{/* Separador */}
						<div className="my-6">
							<div className="w-full border-t border-gray-600"></div>
						</div>

						{/* Link a login */}
						<div className="text-center">
							<p className="text-sm text-gray-600">
								¿Ya tienes una cuenta?{' '}
								<a 
									href="/login" 
									className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
								>
									Inicia sesión aquí
								</a>
							</p>
						</div>
					</div>

					{/* Footer */}
					<div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
						<p className="text-xs text-gray-500">
							© 2025 SmartSales365. Todos los derechos reservados.
						</p>
					</div>
				</div>

				{/* Texto informativo debajo */}
				<div className="mt-6 text-center">
					<p className="text-white text-sm drop-shadow-lg">
						🔒 Tus datos están protegidos con encriptación de extremo a extremo
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterForm;
