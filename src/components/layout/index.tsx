/* ========== LAYOUT COMPONENTS ========== */

import React, { ReactNode, useState } from 'react';
import { Button, Avatar, Badge } from '@/components/ui';

// ==================== HEADER ====================
interface HeaderProps {
  user?: { name: string; avatar?: string };
  onLogout?: () => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  notificationCount,
  onNotificationClick
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="
      bg-gradient-to-r from-navy-900 to-navy-800
      border-b-2 border-gold-500
      sticky top-0 z-50
      px-6 py-4 shadow-lg
    ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 rounded-xl
            bg-gradient-to-br from-gold-500 to-gold-600
            flex items-center justify-center
            text-xl font-bold text-navy-900
            shadow-lg
          ">
            ⚽
          </div>
          <div>
            <h1 className="text-lg font-black text-primary">Figurinhas Cup 2026</h1>
            <p className="text-xs text-secondary uppercase tracking-widest">Seu Gerenciador</p>
          </div>
        </div>

        {/* Center - Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-secondary">Mercado Aberto</span>
          </div>
          <div className="text-sm text-secondary font-mono">
            {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-navy-700 rounded-lg transition"
          >
            🔔
            {notificationCount !== undefined && notificationCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-1 -right-1 text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-navy-700 rounded-lg transition"
              >
                <Avatar
                  initials={user.name
                    .split(' ')
                    .slice(0, 2)
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                  size="sm"
                />
                <span className="text-sm font-semibold text-primary hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="
                  absolute right-0 top-full mt-2
                  bg-navy-800 border border-navy-700 rounded-lg shadow-lg
                  min-w-48 p-2 z-dropdown
                ">
                  <button className="
                    w-full text-left px-4 py-2 rounded hover:bg-navy-700
                    text-sm text-primary transition
                  ">
                    👤 Meu Perfil
                  </button>
                  <button className="
                    w-full text-left px-4 py-2 rounded hover:bg-navy-700
                    text-sm text-primary transition
                  ">
                    ⚙️ Configurações
                  </button>
                  <hr className="border-navy-700 my-2" />
                  <button
                    onClick={() => {
                      onLogout?.();
                      setUserMenuOpen(false);
                    }}
                    className="
                      w-full text-left px-4 py-2 rounded hover:bg-red-500 hover:bg-opacity-10
                      text-sm text-error transition
                    "
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ==================== SIDEBAR ====================
interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  activeItem?: string;
  onNavigate?: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItem,
  onNavigate,
  isOpen = true,
  onClose
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-modal"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-64px)]
        w-64 bg-navy-800 border-r border-navy-700
        overflow-y-auto transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0 z-40 lg:z-auto
      `}>
        <nav className="p-4 flex flex-col gap-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate?.(item.id);
                onClose?.();
              }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition text-sm font-semibold
                ${activeItem === item.id
                  ? 'bg-gold-500 text-navy-900'
                  : 'text-primary hover:bg-navy-700'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="error" size="sm" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

// ==================== LAYOUT WRAPPER ====================
interface LayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, sidebar, children }) => {
  return (
    <div className="min-h-screen bg-navy-900">
      {header}
      <div className="flex">
        {sidebar}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// ==================== PAGE HEADER ====================
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-black text-primary">{title}</h1>
        {description && <p className="text-secondary mt-2">{description}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

// ==================== SECTION ====================
interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, description, children }) => {
  return (
    <section className="mb-8">
      {title && (
        <div className="mb-6 pb-4 border-b border-navy-700">
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
          {description && <p className="text-secondary mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};

// ==================== STATS CARD ====================
interface StatsCardProps {
  label: string;
  value: string | number;
  change?: { value: number; direction: 'up' | 'down' };
  icon?: ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, change, icon }) => {
  return (
    <div className="
      bg-navy-800 border border-navy-700 rounded-xl p-6
      hover:border-gold-500 transition
    ">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs uppercase text-secondary tracking-widest font-semibold">
          {label}
        </p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-gold-500">{value}</p>
        {change && (
          <p className={`text-sm font-semibold ${
            change.direction === 'up' ? 'text-success' : 'text-error'
          }`}>
            {change.direction === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
          </p>
        )}
      </div>
    </div>
  );
};

// ==================== GRID ====================
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'md' | 'lg' | 'xl';
}

export const Grid: React.FC<GridProps> = ({ children, cols = 3, gap = 'lg' }) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const gapClass = {
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={`grid ${colsClass[cols]} ${gapClass[gap]}`}>
      {children}
    </div>
  );
};
