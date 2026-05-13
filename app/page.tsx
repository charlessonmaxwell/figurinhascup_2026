/* ========== MAIN APP COMPONENT ========== */

'use client';

import React, { useState } from 'react';
import Dashboard from '@/pages/Dashboard';
import MeuAlbum from '@/pages/Album';
import { Repetidas, Faltantes, Perfil, Notificacoes } from '@/pages/Secondary';

// ==================== APP ROUTER ====================
type Page = 'dashboard' | 'album' | 'repetidas' | 'faltantes' | 'mercado' | 'notificacoes' | 'perfil' | 'login';

interface AppProps {
  initialPage?: Page;
}

export const App: React.FC<AppProps> = ({ initialPage = 'dashboard' }) => {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);

  // Navigation handler
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  // Render page based on current route
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'album':
        return <MeuAlbum />;
      case 'repetidas':
        return <Repetidas />;
      case 'faltantes':
        return <Faltantes />;
      case 'notificacoes':
        return <Notificacoes />;
      case 'perfil':
        return <Perfil />;
      case 'mercado':
        return <div className="p-8 text-center text-gray-600">Página Mercado em desenvolvimento...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {renderPage()}
    </div>
  );
};

// ==================== EXPORT ALL PAGES ========== 
export { Dashboard, MeuAlbum, Repetidas, Faltantes, Perfil, Notificacoes };

// ==================== DOCUMENTATION ====================
// Para documentação completa sobre como usar a aplicação,
// veja o arquivo COMPREHENSIVE_TEST_REPORT.md

export default function Home() {
  return <App initialPage="dashboard" />;
}
