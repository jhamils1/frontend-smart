import React from 'react';
import Sidebar from '../../components/sidebar';
import DetalleNotaDeVentaList from './detalleNotaDeVentaList';

const DetalleNotaDeVentaPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">📦 Detalles de Nota de Venta</h1>
                            <p className="text-gray-600 mt-1">Visualiza los productos y detalles de las notas de venta</p>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <DetalleNotaDeVentaList />
                </div>
            </main>
        </div>
    );
};

export default DetalleNotaDeVentaPage;
