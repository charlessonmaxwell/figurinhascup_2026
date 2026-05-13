/* ========== MEU ÁLBUM PAGE ========== */

import React, { useState, useMemo } from 'react';
import { StickerCard, StickerGrid, StickerList } from '@/components/sticker';
import { Header, Sidebar, PageHeader, Section, Layout, Grid } from '@/components/layout';
import { Input, Select, Button, Badge } from '@/components/ui';
import { useAuth, useCollection, useSearch, useSort } from '@/hooks';
import { useUIStore } from '@/store/zustand';

const MOCK_STICKERS = [
  { ticker: 'BRA01', name: 'Alisson', flag: '🇧🇷', country: 'Brasil', position: 'Goleiro', tier: 'A' as const, price: 5.50, change: 2.3, quantity: 1, has: true, want: false, trade: false },
  { ticker: 'BRA02', name: 'Ederson', flag: '🇧🇷', country: 'Brasil', position: 'Goleiro', tier: 'A' as const, price: 4.80, change: -1.2, quantity: 3, has: true, want: false, trade: true },
  { ticker: 'ARG01', name: 'Emiliano Martínez', flag: '🇦🇷', country: 'Argentina', position: 'Goleiro', tier: 'S' as const, price: 12.50, change: 5.6, quantity: 1, has: false, want: true, trade: false },
  { ticker: 'ARG15', name: 'Lionel Messi', flag: '🇦🇷', country: 'Argentina', position: 'Atacante', tier: 'S' as const, price: 15.00, change: 8.5, quantity: 1, has: true, want: false, trade: false },
  { ticker: 'FRA01', name: 'Hugo Lloris', flag: '🇫🇷', country: 'França', position: 'Goleiro', tier: 'A' as const, price: 6.20, change: 3.1, quantity: 1, has: true, want: false, trade: false },
  { ticker: 'FRA18', name: 'Kylian Mbappé', flag: '🇫🇷', country: 'França', position: 'Atacante', tier: 'S' as const, price: 11.20, change: 6.2, quantity: 1, has: true, want: false, trade: false },
  { ticker: 'ESP13', name: 'Lamine Yamal', flag: '🇪🇸', country: 'Espanha', position: 'Extremo', tier: 'B' as const, price: 8.90, change: 12.3, quantity: 2, has: true, want: false, trade: true },
  { ticker: 'ENG16', name: 'Harry Kane', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'Inglaterra', position: 'Atacante', tier: 'A' as const, price: 9.80, change: 5.1, quantity: 1, has: false, want: true, trade: false },
  { ticker: 'DEU10', name: 'Jamal Musiala', flag: '🇩🇪', country: 'Alemanha', position: 'Meio-campo', tier: 'A' as const, price: 7.50, change: 4.2, quantity: 1, has: true, want: false, trade: false },
];

// ==================== MEU ÁLBUM COMPONENT ====================
export const MeuAlbum: React.FC = () => {
  const auth = useAuth();
  const collection = useCollection();
  const { sidebarOpen } = useUIStore();

  // State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [status, setStatus] = useState<'all' | 'have' | 'want' | 'trade'>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | 'S' | 'A' | 'B' | 'C'>('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStickerDetail, setSelectedStickerDetail] = useState<string | null>(null);

  // Navigation
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'album', label: 'Meu Álbum', icon: '📚', href: '/album' },
    { id: 'repetidas', label: 'Repetidas', icon: '🔄', href: '/repetidas' },
    { id: 'faltantes', label: 'Faltantes', icon: '❌', href: '/faltantes' },
    { id: 'mercado', label: 'Mercado', icon: '📈', href: '/mercado' },
    { id: 'notificacoes', label: 'Notificações', icon: '🔔', href: '/notificacoes' },
    { id: 'perfil', label: 'Perfil', icon: '👤', href: '/perfil' }
  ];

  // Filtered stickers
  const filtered = useMemo(() => {
    let result = MOCK_STICKERS.filter(s => {
      // Status filter
      if (status === 'have' && !s.has) return false;
      if (status === 'want' && !s.want) return false;
      if (status === 'trade' && !s.trade) return false;

      // Tier filter
      if (selectedTier !== 'all' && s.tier !== selectedTier) return false;

      // Country filter
      if (selectedCountry !== 'all' && s.country !== selectedCountry) return false;

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!s.name.toLowerCase().includes(query) &&
            !s.country.toLowerCase().includes(query) &&
            !s.ticker.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });

    return result;
  }, [status, selectedTier, selectedCountry, searchQuery]);

  const handleStatusChange = (ticker: string, type: 'have' | 'want' | 'trade', value: boolean) => {
    // Simulate update
    console.log(`Updated ${ticker} - ${type}: ${value}`);
  };

  const uniqueCountries = ['all', ...new Set(MOCK_STICKERS.map(s => s.country))];

  return (
    <Layout
      header={
        <Header
          user={auth.user}
          onLogout={auth.logout}
        />
      }
      sidebar={
        <Sidebar
          items={navItems}
          activeItem="album"
          isOpen={sidebarOpen}
        />
      }
    >
      {/* Page Header */}
      <PageHeader
        title="Meu Álbum"
        description="Gerencie suas figurinhas e acompanhe seu progresso"
        actions={
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              ≡ Lista
            </Button>
          </div>
        }
      />

      {/* Filters Section */}
      <Section title="Filtros" description="Refine sua busca">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search */}
          <Input
            placeholder="🔍 Buscar por nome, país, ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Status Filter */}
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'have', label: '✓ Tenho' },
              { value: 'want', label: '⭐ Quero' },
              { value: 'trade', label: '🔄 Para Trocar' }
            ]}
          />

          {/* Tier Filter */}
          <Select
            label="Tier"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as any)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'S', label: '⭐ Tier S' },
              { value: 'A', label: '🎖️ Tier A' },
              { value: 'B', label: '🏅 Tier B' },
              { value: 'C', label: '📌 Tier C' }
            ]}
          />

          {/* Country Filter */}
          <Select
            label="País"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            options={uniqueCountries.map(country => ({
              value: country,
              label: country === 'all' ? 'Todos os Países' : country
            }))}
          />
        </div>

        {/* Filter Tags */}
        {(status !== 'all' || selectedTier !== 'all' || selectedCountry !== 'all' || searchQuery) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {status !== 'all' && (
              <Badge variant="info" size="sm">
                Status: {status}
                <button
                  onClick={() => setStatus('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ✕
                </button>
              </Badge>
            )}
            {selectedTier !== 'all' && (
              <Badge variant="info" size="sm">
                Tier: {selectedTier}
                <button
                  onClick={() => setSelectedTier('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ✕
                </button>
              </Badge>
            )}
            {selectedCountry !== 'all' && (
              <Badge variant="info" size="sm">
                País: {selectedCountry}
                <button
                  onClick={() => setSelectedCountry('all')}
                  className="ml-2 hover:opacity-70"
                >
                  ✕
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="info" size="sm">
                Busca: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 hover:opacity-70"
                >
                  ✕
                </button>
              </Badge>
            )}
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => {
                setStatus('all');
                setSelectedTier('all');
                setSelectedCountry('all');
                setSearchQuery('');
              }}
            >
              Limpar Tudo
            </Button>
          </div>
        )}
      </Section>

      {/* Results Summary */}
      <Section>
        <div className="flex items-center justify-between p-4 bg-navy-800 rounded-lg mb-6">
          <div>
            <p className="text-sm text-secondary">Figurinhas encontradas</p>
            <p className="text-2xl font-bold text-gold-500">{filtered.length} / {MOCK_STICKERS.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-secondary">Progresso</p>
            <p className="text-lg font-bold text-primary">
              {((filtered.length / MOCK_STICKERS.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Section>

      {/* Stickers Display */}
      <Section>
        {viewMode === 'grid' ? (
          <StickerGrid
            stickers={filtered}
            onStatusChange={handleStatusChange}
            onStickerClick={(ticker) => setSelectedStickerDetail(ticker)}
          />
        ) : (
          <StickerList
            stickers={filtered}
            columns={['flag', 'name', 'country', 'tier', 'price', 'change', 'actions']}
          />
        )}
      </Section>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Section>
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <h3 className="text-lg font-bold text-primary mb-2">Nenhuma figurinha encontrada</h3>
            <p className="text-secondary mb-6">Ajuste seus filtros e tente novamente</p>
            <Button
              variant="primary"
              onClick={() => {
                setStatus('all');
                setSelectedTier('all');
                setSelectedCountry('all');
                setSearchQuery('');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </Section>
      )}
    </Layout>
  );
};

export default MeuAlbum;
