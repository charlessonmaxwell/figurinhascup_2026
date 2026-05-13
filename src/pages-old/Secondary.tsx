/* ========== REPETIDAS, FALTANTES, PERFIL & NOTIFICAÇÕES PAGES ========== */

import React, { useState } from 'react';
import { Header, Sidebar, PageHeader, Section, Layout, StatsCard, Grid } from './03-components-layout';
import { Button, Card, Input, Badge, Checkbox, Modal, Toast } from './02-components-ui';
import { useAuth, useCollection, useNotifications } from './05-hooks-custom';
import { useUIStore } from './04-store-zustand';

// ==================== REPETIDAS PAGE ====================
export const Repetidas: React.FC = () => {
  const auth = useAuth();
  const collection = useCollection();
  const { sidebarOpen } = useUIStore();
  const [selectedForTrade, setSelectedForTrade] = useState<number[]>([]);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'album', label: 'Meu Álbum', icon: '📚', href: '/album' },
    { id: 'repetidas', label: 'Repetidas', icon: '🔄', href: '/repetidas' },
    { id: 'faltantes', label: 'Faltantes', icon: '❌', href: '/faltantes' },
  ];

  const tradingStickers = collection.getTradingStickers();
  const totalValue = tradingStickers.reduce((sum, s) => sum + (s.quantity - 1) * 5, 0); // Mock price

  return (
    <Layout
      header={<Header user={auth.user} onLogout={auth.logout} />}
      sidebar={<Sidebar items={navItems} activeItem="repetidas" isOpen={sidebarOpen} />}
    >
      <PageHeader
        title="Repetidas"
        description="Figurinhas que você tem em duplicata"
        actions={
          <Button variant="primary" onClick={() => setTradeModalOpen(true)}>
            🔄 Oferecer Trades
          </Button>
        }
      />

      {/* Stats */}
      <Section>
        <Grid cols={3}>
          <StatsCard
            label="Total de Repetidas"
            value={tradingStickers.length}
            icon="🔄"
          />
          <StatsCard
            label="Valor Total"
            value={`R$ ${totalValue.toFixed(2)}`}
            icon="💰"
          />
          <StatsCard
            label="Maior Valor"
            value="R$ 8.50"
            icon="👑"
          />
        </Grid>
      </Section>

      {/* Stickers Table */}
      <Section title="Suas Repetidas">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-navy-700">
                <th className="px-4 py-3 text-left font-bold text-gray-700">Figurinha</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Quantidade</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Preço Unit.</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Valor Total</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tradingStickers.length > 0 ? (
                tradingStickers.map((sticker) => (
                  <tr key={sticker.stickerId} className="border-b border-navy-700 hover:bg-navy-800">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>🇧🇷</span>
                        <div>
                          <p className="font-bold text-navy-900">Sample Sticker</p>
                          <p className="text-xs text-gray-600 font-mono">STK{sticker.stickerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold">×{sticker.quantity}</td>
                    <td className="px-4 py-3 font-mono">R$ 5.50</td>
                    <td className="px-4 py-3 font-mono font-bold text-gold-500">
                      R$ {(5.50 * sticker.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="secondary">
                        Oferecer
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-600">
                    Você não tem figurinhas repetidas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Trade Modal */}
      <Modal
        isOpen={tradeModalOpen}
        title="🔄 Oferecer Trade"
        onClose={() => setTradeModalOpen(false)}
        actions={[
          { label: 'Cancelar', variant: 'secondary', onClick: () => setTradeModalOpen(false) },
          { label: 'Oferecer', variant: 'primary', onClick: () => setTradeModalOpen(false) }
        ]}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Selecione as figurinhas que você quer em troca
          </p>
          <Input placeholder="🔍 Buscar figurinhas..." />
        </div>
      </Modal>
    </Layout>
  );
};

// ==================== FALTANTES PAGE ====================
export const Faltantes: React.FC = () => {
  const auth = useAuth();
  const collection = useCollection();
  const { sidebarOpen } = useUIStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'album', label: 'Meu Álbum', icon: '📚', href: '/album' },
    { id: 'repetidas', label: 'Repetidas', icon: '🔄', href: '/repetidas' },
    { id: 'faltantes', label: 'Faltantes', icon: '❌', href: '/faltantes' },
  ];

  const missingStickers = collection.getMissingStickers();
  const totalCost = missingStickers.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <Layout
      header={<Header user={auth.user} onLogout={auth.logout} />}
      sidebar={<Sidebar items={navItems} activeItem="faltantes" isOpen={sidebarOpen} />}
    >
      <PageHeader
        title="Faltantes"
        description="Figurinhas que faltam para completar seu álbum"
      />

      {/* Stats */}
      <Section>
        <Grid cols={3}>
          <StatsCard
            label="Faltando"
            value={missingStickers.length}
            icon="❌"
          />
          <StatsCard
            label="Custo Total"
            value={`R$ ${totalCost.toFixed(2)}`}
            icon="💸"
          />
          <StatsCard
            label="Custo Médio"
            value={`R$ ${(totalCost / Math.max(missingStickers.length, 1)).toFixed(2)}`}
            icon="📊"
          />
        </Grid>
      </Section>

      {/* Recommendations */}
      <Section title="💡 Recomendações">
        <Card>
          <h3 className="text-lg font-bold text-primary mb-3">Comece por Brasil</h3>
          <p className="text-sm text-secondary mb-4">
            Você tem 15/18 figurinhas. Investir nas 3 faltantes custa apenas R$ 12.30
          </p>
          <Button variant="primary">Ver Brasil Completo</Button>
        </Card>
      </Section>

      {/* Missing List */}
      <Section title="Faltando" description={`${missingStickers.length} figurinhas`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {missingStickers.slice(0, 10).map((sticker, idx) => (
            <Card key={idx} interactive className="text-center p-6">
              <p className="text-3xl mb-2">❓</p>
              <p className="text-sm font-bold text-primary mb-1">{sticker.name}</p>
              <p className="text-xs text-secondary mb-2">{sticker.country}</p>
              <p className="font-mono font-bold text-gold-500">R$ {sticker.price?.toFixed(2)}</p>
            </Card>
          ))}
        </div>
      </Section>
    </Layout>
  );
};

// ==================== PERFIL PAGE ====================
export const Perfil: React.FC = () => {
  const auth = useAuth();
  const { sidebarOpen } = useUIStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    bio: '',
    location: ''
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'album', label: 'Meu Álbum', icon: '📚', href: '/album' },
    { id: 'perfil', label: 'Perfil', icon: '👤', href: '/perfil' },
  ];

  return (
    <Layout
      header={<Header user={auth.user} onLogout={auth.logout} />}
      sidebar={<Sidebar items={navItems} activeItem="perfil" isOpen={sidebarOpen} />}
    >
      <PageHeader
        title="Meu Perfil"
        description="Gerencie suas informações e preferências"
        actions={
          <Button
            variant={editMode ? 'secondary' : 'primary'}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '❌ Cancelar' : '✏️ Editar'}
          </Button>
        }
      />

      {/* Profile Header */}
      <Section>
        <Card variant="hero">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-3xl text-navy-900">
              {auth.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary">{auth.user?.name}</h2>
              <p className="text-secondary">@{auth.user?.username || 'usuario'}</p>
              <p className="text-sm text-secondary mt-2">
                Membro desde {new Date(auth.user?.createdAt || '').toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {editMode && (
            <div className="space-y-4 border-t border-navy-700 pt-6">
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Sobre você..."
              />
              <Input
                label="Localização"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Sua cidade"
              />
              <Button variant="primary" fullWidth>
                Salvar Alterações
              </Button>
            </div>
          )}
        </Card>
      </Section>

      {/* Statistics */}
      <Section title="📊 Estatísticas">
        <Grid cols={4}>
          <StatsCard label="Figurinhas" value="42" icon="📦" />
          <StatsCard label="Valor Portfolio" value="R$ 342.50" icon="💰" />
          <StatsCard label="Completude" value="48.8%" icon="🎯" />
          <StatsCard label="Trades Realizados" value="12" icon="🔄" />
        </Grid>
      </Section>

      {/* Preferences */}
      <Section title="⚙️ Preferências">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary">Notificações de Preço</p>
                <p className="text-sm text-secondary">Receber alertas quando preços mudam</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary">Perfil Público</p>
                <p className="text-sm text-secondary">Permitir que outros vejam seu portfolio</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-gold-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary">Modo Escuro</p>
                <p className="text-sm text-secondary">Ativar tema escuro (já ativo)</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold-500" />
            </div>
          </div>
        </Card>
      </Section>

      {/* Danger Zone */}
      <Section title="⚠️ Zona de Perigo">
        <Card className="border-2 border-error">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-error">Deletar Conta</p>
              <p className="text-sm text-secondary">Esta ação é irreversível</p>
            </div>
            <Button variant="danger">Deletar</Button>
          </div>
        </Card>
      </Section>
    </Layout>
  );
};

// ==================== NOTIFICAÇÕES PAGE ====================
export const Notificacoes: React.FC = () => {
  const auth = useAuth();
  const notifications = useNotifications();
  const { sidebarOpen } = useUIStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'notificacoes', label: 'Notificações', icon: '🔔', href: '/notificacoes' },
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: '1',
      type: 'price_drop' as const,
      title: '📉 Preço Caiu',
      message: 'ARG15 (Messi) caiu para R$ 11.80',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      type: 'trade_offer' as const,
      title: '🔄 Oferta de Trade',
      message: 'João ofereceu BRA02 por seus repetidas',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      type: 'system' as const,
      title: '📢 Nova Figurinha Disponível',
      message: 'POZ13 foi adicionada ao mercado',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const filtered = filter === 'unread' 
    ? mockNotifications.filter(n => !n.isRead)
    : mockNotifications;

  return (
    <Layout
      header={<Header user={auth.user} onLogout={auth.logout} />}
      sidebar={<Sidebar items={navItems} activeItem="notificacoes" isOpen={sidebarOpen} />}
    >
      <PageHeader
        title="Notificações"
        description="Fique atualizado sobre suas figurinhas"
        actions={
          <Button variant="secondary" size="sm">
            🗑️ Limpar Tudo
          </Button>
        }
      />

      {/* Filter */}
      <Section>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            Todos ({mockNotifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'secondary'}
            onClick={() => setFilter('unread')}
          >
            Não Lidas ({mockNotifications.filter(n => !n.isRead).length})
          </Button>
        </div>
      </Section>

      {/* Notifications List */}
      <Section>
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((notif) => (
              <Card
                key={notif.id}
                interactive
                className={notif.isRead ? 'opacity-60' : ''}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-primary">{notif.title}</h4>
                    <p className="text-sm text-secondary mt-1">{notif.message}</p>
                    <p className="text-xs text-dim mt-2">
                      {new Date(notif.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <Badge variant="info" size="sm">
                      Novo
                    </Badge>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-secondary">Sem notificações</p>
            </div>
          )}
        </div>
      </Section>
    </Layout>
  );
};

export default { Repetidas, Faltantes, Perfil, Notificacoes };
