import React, { useState } from "react";
import Sidebar from "../../components/sidebar.jsx";
import BackupList from "./backupList.jsx";

const BackupPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isVisible={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header principal */}
        <header className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                💾 Sistema de Backup y Restauración
              </h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Gestiona tus backups automáticos y manuales. Restaura el sistema desde cualquier punto.
          </p>
        </header>

        {/* Contenido */}
        <div className="p-6">
          <BackupList />
        </div>
      </main>
    </div>
  );
};

export default BackupPage;

