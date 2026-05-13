/* ========== DASHBOARD PAGE ========== */

import React, { useEffect, useState } from 'react';
import {
  Header, Sidebar, PageHeader, Section, StatsCard, Grid, Layout
} from '@/components/layout';
import { Card, Button, Badge, Progress, Spinner, EmptyState } from '@/components/ui';
import { useAuth, useCollection, useNotifications } from '@/hooks';
import { useUIStore } from '@/store/zustand';

// ==================== DASHBOARD COMPONENT ====================
export const Dashboard: React.FC = () => {
  const auth = useAuth();
  const collection = useCollection();
  const notifications = useNotifications();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'recent'>('overview');

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard', badge: undefined },
    { id: 'album', label: 'Meu Álbum', icon: '📚', href: '/album', badge: collection.stats.wanted },
    { id: 'repetidas', label: 'Repetidas', icon: '🔄', href: '/repetidas', badge: collection.stats.trading },
    { id: 'faltantes', label: 'Faltantes', icon: '❌', href: '/faltantes', badge: collection.stats.missing },
    { id: 'mercado', label: 'Mercado', icon: '📈', href: '/mercado' },
    { id: 'notificacoes', label: 'Notificações', icon: '🔔', href: '/notificacoes', badge: notifications.unreadCount },
    { id: 'perfil', label: 'Perfil', icon: '👤', href: '/perfil' }
  ];

  // Mock sticker data
  const topPerformers = [
    { ticker: 'ARG15', name: 'Lionel Messi', flag: '🇦🇷', price: 12.50, change: 8.5 },
    { ticker: 'FRA18', name: 'Kylian Mbappé', flag: '🇫🇷', price: 11.20, change: 6.2 },
    { ticker: 'ENG16', name: 'Harry Kane', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', price: 9.80, change: 5.1 },
    { ticker: 'BRA12', name: 'Vinícius Júnior', flag: '🇧🇷', price: 10.50, change: 4.8 },
    { ticker: 'ESP13', name: 'Lamine Yamal', flag: '🇪🇸', price: 8.90, change: 12.3 }
  ];

  const recommendations = [
    { title: 'Você tem 15/18 de Brasil', description: 'Invista nas 3 figurinhas faltantes para completar a seleção', tier: 'A' },
    { title: 'Preço caiu 15%', description: 'MEX13 (Hirving Lozano) está em promoção - ótima oportunidade!', tier: 'B' },
    { title: 'Figurinha rara apareceu', description: 'POZ13 (novo) foi adicionado ao mercado - demanda alta', tier: 'S' }
  ];

  // Simulate data loading
  useEffect(() => {
    // Simulate initial data load
    collection.setLoading(true);
    setTimeout(() => {
      collection.setLoading(false);
      // Add some initial stickers
      collection.addSticker(109, 1);
      collection.addSticker(120, 1);
      collection.addSticker(121, 2);
      collection.addSticker(397, 1);
      collection.addSticker(411, 1);
    }, 1000);
  }, []);

  if (!auth.user) {
    return <EmptyState icon="🔐" title="Não autenticado" description="Faça login para acessar o dashboard" />;
  }

  return (
    <Layout
      header={
        <Header
          user={auth.user}
          onLogout={auth.logout}
          notificationCount={notifications.unreadCount}
          onNotificationClick={() => setActiveTab('overview')}
        />
      }
      sidebar={
        <Sidebar
          items={navItems}
          activeItem="dashboard"
          isOpen={sidebarOpen}
          onClose={() => useUIStore.setState({ sidebarOpen: false })}
        />
      }
    >
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao seu gerenciador de figurinhas"
      />

      {/* Portfolio Hero */}
      <Section>
        <Card variant="hero">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase text-secondary tracking-widest font-semibold">
                Seu Portfolio
              </p>
              <h2 className="text-4xl font-black text-gold-500 mt-2">
                R$ {collection.stats.portfolioValue.toFixed(2)}
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="text-xs text-secondary">Completude do Álbum</p>
                  <Progress
                    value={collection.stats.completionPercentage}
                    showLabel
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-black text-success">
                  {collection.stats.owned}
                </p>
                <p className="text-xs text-secondary uppercase">Possuindo</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-info">
                  {collection.stats.trading}
                </p>
                <p className="text-xs text-secondary uppercase">Para Trocar</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-warning">
                  {collection.stats.wanted}
                </p>
                <p className="text-xs text-secondary uppercase">Desejos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-error">
                  {collection.stats.missing}
                </p>
                <p className="text-xs text-secondary uppercase">Faltam</p>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Stats Grid */}
      <Section>
        <Grid cols={4}>
          <StatsCard
            label="Figurinhas Possuindo"
            value={collection.stats.owned}
            icon="📦"
            change={{ value: 12, direction: 'up' }}
          />
          <StatsCard
            label="Valor Médio"
            value={`R$ ${(collection.stats.portfolioValue / Math.max(collection.stats.owned, 1)).toFixed(2)}`}
            icon="💰"
            change={{ value: 5, direction: 'up' }}
          />
          <StatsCard
            label="Completude"
            value={`${collection.stats.completionPercentage.toFixed(1)}%`}
            icon="🎯"
            change={{ value: 8, direction: 'up' }}
          />
          <StatsCard
            label="Seleções Completas"
            value="2/48"
            icon="🏆"
          />
        </Grid>
      </Section>

      {/* Tabs */}
      <Section>
        <div className="flex gap-4 mb-6 border-b border-navy-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-secondary hover:text-primary'
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'recent'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-secondary hover:text-primary'
            }`}
          >
            🕐 Recentes
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Top Performers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary mb-4">
                🏆 Suas Figurinhas de Maior Valor
              </h3>
              <div className="space-y-3">
                {collection.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : topPerformers.length > 0 ? (
                  topPerformers.map((sticker, idx) => (
                    <div
                      key={idx}
                      className="
                        flex items-center justify-between p-4
                        bg-navy-800 border border-navy-700 rounded-lg
                        hover:border-gold-500 transition cursor-pointer
                      "
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{sticker.flag}</span>
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {sticker.name}
                          </p>
                          <p className="text-xs text-secondary font-mono">
                            {sticker.ticker}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gold-500 font-mono">
                          R$ {sticker.price.toFixed(2)}
                        </p>
                        <p className={`text-sm font-semibold ${
                          sticker.change > 0 ? 'text-success' : 'text-error'
                        }`}>
                          {sticker.change > 0 ? '↑' : '↓'} {Math.abs(sticker.change).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon="📭"
                    title="Nenhuma figurinha adicionada"
                    description="Comece a adicionar figurinhas ao seu álbum"
                  />
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">
                💡 Recomendações Personalizadas
              </h3>
              <Grid cols={3}>
                {recommendations.map((rec, idx) => (
                  <Card key={idx} interactive>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-primary mb-1">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-secondary mb-3">
                          {rec.description}
                        </p>
                        <Badge variant="info" size="sm">
                          Tier {rec.tier}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </div>
          </>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-3">
            <p className="text-secondary">Atividades recentes aparecerão aqui...</p>
            <EmptyState
              icon="📭"
              title="Sem atividades recentes"
              description="Adicione figurinhas para ver seu histórico"
            />
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section>
        <Card className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Comece a Colecionar</h3>
              <p className="text-sm opacity-90">
                Explore o mercado e adicione figurinhas ao seu álbum
              </p>
            </div>
            <Button variant="secondary">
              🔍 Explorar Mercado
            </Button>
          </div>
        </Card>
      </Section>
    </Layout>
  );
};

export default Dashboard;
