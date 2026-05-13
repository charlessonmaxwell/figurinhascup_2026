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

// ==================== QUICK START GUIDE ====================
/*

COMO USAR A ÁREA LOGADA

1. IMPORTAÇÃO BÁSICA:
   import { App } from './app'
   
   <App initialPage="dashboard" />

2. PÁGINAS DISPONÍVEIS:
   - Dashboard: Visão geral do portfolio
   - Meu Álbum: Gerenciamento de figurinhas
   - Repetidas: Figurinhas para trocar
   - Faltantes: Figurinhas que faltam
   - Perfil: Dados do usuário
   - Notificações: Centro de notificações
   - Mercado: Explorar mercado (em desenvolvimento)

3. ESTRUTURA DO PROJETO:

   /components
     ├── ui/
     │   ├── Button.tsx
     │   ├── Card.tsx
     │   ├── Input.tsx
     │   └── ...outros componentes
     ├── layout/
     │   ├── Header.tsx
     │   ├── Sidebar.tsx
     │   └── Layout.tsx
     └── sticker/
         ├── StickerCard.tsx
         ├── StickerGrid.tsx
         └── StickerModal.tsx

   /pages
     ├── Dashboard.tsx
     ├── Album.tsx
     ├── Repetidas.tsx
     ├── Faltantes.tsx
     ├── Perfil.tsx
     └── Notificacoes.tsx

   /hooks
     ├── useAuth.ts
     ├── useCollection.ts
     ├── useNotifications.ts
     └── ...outros hooks

   /store
     └── zustand.ts (Estado global)

   /styles
     └── tokens.css (Design tokens)

4. CONFIGURAÇÃO INICIAL:

   a) Instalar dependências:
      npm install zustand

   b) Importar styles global:
      import './styles/tokens.css'

   c) Configurar provider (se usando Context):
      <Provider store={appStore}>
        <App />
      </Provider>

5. CUSTOMIZAÇÕES:

   a) Adicionar novo estado:
      // Em ./store/zustand.ts
      export const useNewStore = create((set) => ({
        // seu estado aqui
      }))

   b) Adicionar novo hook:
      // Em ./hooks/custom.ts
      export const useNewHook = () => {
        // sua lógica aqui
      }

   c) Adicionar novo componente:
      // Em ./components/ui/NewComponent.tsx
      export const NewComponent = () => {
        // seu componente
      }

   d) Adicionar nova página:
      // Em ./pages/NewPage.tsx
      export const NewPage = () => {
        return (
          <Layout header={...} sidebar={...}>
            {/* conteúdo */}
          </Layout>
        )
      }

6. INTEGRAÇÃO COM API:

   a) Em ./hooks/custom.ts:
      
      export const useAuth = () => {
        const login = async (email: string, password: string) => {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          })
          const data = await response.json()
          // atualizar store com dados
        }
      }

   b) Usar em componentes:
      
      const { user, login } = useAuth()
      
      const handleLogin = async () => {
        await login(email, password)
      }

7. TEMAS E CUSTOMIZAÇÃO:

   a) Cores em ./styles/tokens.css:
      --color-gold-500: #FFD700;
      --color-navy-900: #0F1628;

   b) Tipografia:
      --font-display: 'Outfit';
      --font-body: 'Outfit';
      --font-mono: 'JetBrains Mono';

   c) Spacing:
      --space-md: 8px;
      --space-xl: 16px;

8. RESPONSIVIDADE:

   Todos os componentes são mobile-first:
   
   - Breakpoints: xs (0px), md (768px), lg (1024px)
   - Grid responsivo: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
   - Sidebar colapsável em mobile
   - Cards adaptativos

9. ACESSIBILIDADE:

   - Todos os inputs têm labels
   - Foco visível em todos os botões
   - ARIA labels onde necessário
   - Contraste adequado
   - Sem conteúdo decorativo em alt text

10. PERFORMANCE:

    - Componentes memoizados
    - Lazy loading de imagens
    - Code splitting por página
    - Estado local quando possível
    - Zustand para estado global eficiente

*/

// ==================== EXEMPLO DE USO ====================
export const ExampleApp = () => {
  return (
    <div>
      <App initialPage="dashboard" />
    </div>
  );
};

// ==================== NEXTJS INTEGRATION ====================
/*

Se usar Next.js, estruture assim:

app/
├── layout.tsx (Global layout com Provider)
├── dashboard/
│   └── page.tsx (Importa Dashboard)
├── album/
│   └── page.tsx (Importa MeuAlbum)
├── repetidas/
│   └── page.tsx (Importa Repetidas)
├── faltantes/
│   └── page.tsx (Importa Faltantes)
├── perfil/
│   └── page.tsx (Importa Perfil)
└── notificacoes/
    └── page.tsx (Importa Notificacoes)

lib/
├── store.ts (Zustand)
├── hooks.ts (Custom hooks)
└── api.ts (API calls)

components/
├── ui/ (Componentes base)
├── layout/ (Header, Sidebar, etc)
└── sticker/ (Componentes de figurinha)

*/

// ==================== API INTEGRATION EXAMPLE ====================
/*

// api/auth.ts
export const apiLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}

export const apiGetUser = async (token: string) => {
  const response = await fetch('/api/user/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return response.json()
}

export const apiGetCollection = async (userId: string, token: string) => {
  const response = await fetch(`/api/collection/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return response.json()
}

// Em useAuth hook:
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
    } catch (error) {
      setError('Login failed')
    }
  }
}

*/

export default function Home() {
  return <App initialPage="dashboard" />;
}
