/* ========== STICKER COMPONENTS ========== */

import React, { useState } from 'react';
import { Modal, Button, Badge, Spinner } from '@/components/ui';

// ==================== STICKER CARD ====================
interface StickerCardProps {
  ticker: string;
  name: string;
  flag: string;
  country: string;
  position: string;
  tier: 'S' | 'A' | 'B' | 'C';
  price: number;
  change: number;
  quantity?: number;
  has?: boolean;
  want?: boolean;
  trade?: boolean;
  onClick?: () => void;
  onStatusChange?: (type: 'have' | 'want' | 'trade', value: boolean) => void;
}

const tierColors = {
  S: 'from-gold-500 to-amber-600',
  A: 'from-pink-500 to-rose-600',
  B: 'from-cyan-500 to-blue-600',
  C: 'from-purple-500 to-indigo-600'
};

const tierBorders = {
  S: 'border-gold-400',
  A: 'border-pink-400',
  B: 'border-cyan-400',
  C: 'border-purple-400'
};

export const StickerCard: React.FC<StickerCardProps> = ({
  ticker,
  name,
  flag,
  country,
  position,
  tier,
  price,
  change,
  quantity = 1,
  has = false,
  want = false,
  trade = false,
  onClick,
  onStatusChange
}) => {
  const changeColor = change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'text-gray-400';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl
        border-4 ${tierBorders[tier]} transition cursor-pointer
        hover:scale-105 hover:-translate-y-1
      `}
    >
      {/* Header - Tier Badge & Flag */}
      <div className="relative bg-gray-100 p-4 text-center">
        <span className="text-5xl">{flag}</span>
        <div className={`
          absolute top-3 left-3 px-2 py-1 rounded text-white text-xs font-bold
          bg-gradient-to-r ${tierColors[tier]}
        `}>
          TIER {tier}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Country */}
        <h4 className="font-bold text-navy-900 text-sm truncate">{name}</h4>
        <p className="text-xs text-gray-600 mb-2">{country}</p>

        {/* Meta Info */}
        <div className="flex justify-between items-center text-xs text-gray-700 mb-3">
          <span className="font-mono">{ticker}</span>
          <span>{position}</span>
        </div>

        {/* Price Box */}
        <div className={`
          bg-gradient-to-r ${tierColors[tier]} text-white rounded-lg
          p-2 text-center mb-3
        `}>
          <p className="font-bold text-sm font-mono">R$ {price.toFixed(2)}</p>
          <p className={`text-xs font-semibold ${changeColor}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </p>
        </div>

        {/* Quantity Badge */}
        {quantity > 1 && (
          <div className="text-center mb-3">
            <Badge variant="info" size="sm">
              ×{quantity} Repetida
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange?.('have', !has);
            }}
            className={`
              flex-1 py-2 rounded-lg text-xs font-bold transition
              ${has
                ? 'bg-success text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
            title="Marcar como tendo"
          >
            {has ? '✓ Tenho' : '⊙ Tenho'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange?.('want', !want);
            }}
            className={`
              flex-1 py-2 rounded-lg text-xs font-bold transition
              ${want
                ? 'bg-info text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
            title="Marcar como querendo"
          >
            {want ? '⭐ Quero' : '☆ Quero'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange?.('trade', !trade);
            }}
            disabled={!has || quantity < 2}
            className={`
              flex-1 py-2 rounded-lg text-xs font-bold transition
              ${trade
                ? 'bg-warning text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
              }
            `}
            title="Marcar como trocável"
          >
            {trade ? '🔄 Trocar' : '↔ Trocar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== STICKER DETAIL MODAL ====================
interface StickerDetailModalProps {
  isOpen: boolean;
  sticker?: {
    ticker: string;
    name: string;
    flag: string;
    country: string;
    position: string;
    tier: 'S' | 'A' | 'B' | 'C';
    price: number;
    change: number;
    volume: number;
    heat: number;
    scarcity: number;
  };
  onClose: () => void;
  onAction?: (action: string) => void;
}

export const StickerDetailModal: React.FC<StickerDetailModalProps> = ({
  isOpen,
  sticker,
  onClose,
  onAction
}) => {
  if (!isOpen || !sticker) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${sticker.flag} ${sticker.name}`}
    >
      <div className="space-y-6">
        {/* Main Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">País</p>
            <p className="font-bold text-navy-900">{sticker.country}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Posição</p>
            <p className="font-bold text-navy-900">{sticker.position}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Ticker</p>
            <p className="font-mono font-bold text-navy-900">{sticker.ticker}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Tier</p>
            <Badge variant={sticker.tier === 'S' ? 'success' : 'info'} size="sm">
              {sticker.tier}
            </Badge>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-xs text-gray-600 uppercase mb-1">Cotação Atual</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-gold-500 font-mono">
              R$ {sticker.price.toFixed(2)}
            </p>
            <p className={sticker.change > 0 ? 'text-success' : 'text-error'}>
              {sticker.change > 0 ? '↑' : '↓'} {Math.abs(sticker.change).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Market Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-navy-100 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600">Volume 24h</p>
            <p className="font-bold text-navy-900">{sticker.volume}</p>
          </div>
          <div className="bg-navy-100 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600">Heat Score</p>
            <p className="font-bold text-navy-900">{sticker.heat}/100</p>
          </div>
          <div className="bg-navy-100 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600">Raridade</p>
            <p className="font-bold text-navy-900">{sticker.scarcity}/100</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              onAction?.('have');
              onClose();
            }}
          >
            ✓ Tenho Esta
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              onAction?.('want');
              onClose();
            }}
          >
            ⭐ Quero
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ==================== STICKER GRID ====================
interface StickerGridProps {
  stickers: StickerCardProps[];
  loading?: boolean;
  onStickerClick?: (ticker: string) => void;
  onStatusChange?: (ticker: string, type: 'have' | 'want' | 'trade', value: boolean) => void;
}

export const StickerGrid: React.FC<StickerGridProps> = ({
  stickers,
  loading,
  onStickerClick,
  onStatusChange
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {loading ? (
        <div className="col-span-full flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : stickers.length > 0 ? (
        stickers.map((sticker) => (
          <StickerCard
            key={sticker.ticker}
            {...sticker}
            onClick={() => onStickerClick?.(sticker.ticker)}
            onStatusChange={(type, value) =>
              onStatusChange?.(sticker.ticker, type, value)
            }
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-600">Nenhuma figurinha encontrada</p>
        </div>
      )}
    </div>
  );
};

// ==================== STICKER LIST ====================
interface StickerListProps {
  stickers: StickerCardProps[];
  columns?: ('flag' | 'name' | 'country' | 'tier' | 'price' | 'change' | 'actions')[];
  loading?: boolean;
  sortBy?: string;
  onSort?: (column: string) => void;
}

export const StickerList: React.FC<StickerListProps> = ({
  stickers,
  columns = ['flag', 'name', 'country', 'tier', 'price', 'change'],
  loading,
  sortBy,
  onSort
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-navy-700">
            {columns.map(col => (
              <th
                key={col}
                onClick={() => onSort?.(col)}
                className={`
                  px-4 py-3 text-left font-bold text-gray-700 uppercase text-xs
                  ${onSort ? 'cursor-pointer hover:text-gold-500' : ''}
                  ${sortBy === col ? 'text-gold-500' : ''}
                `}
              >
                {col === 'flag' && '🚩'}
                {col === 'name' && 'Nome'}
                {col === 'country' && 'País'}
                {col === 'tier' && 'Tier'}
                {col === 'price' && 'Preço'}
                {col === 'change' && 'Mudança'}
                {col === 'actions' && 'Ações'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8">
                <Spinner size="md" />
              </td>
            </tr>
          ) : stickers.length > 0 ? (
            stickers.map((sticker) => (
              <tr
                key={sticker.ticker}
                className="border-b border-navy-700 hover:bg-navy-800 transition"
              >
                {columns.includes('flag') && (
                  <td className="px-4 py-3 text-2xl">{sticker.flag}</td>
                )}
                {columns.includes('name') && (
                  <td className="px-4 py-3">
                    <p className="font-bold text-navy-900">{sticker.name}</p>
                    <p className="text-xs text-gray-600 font-mono">{sticker.ticker}</p>
                  </td>
                )}
                {columns.includes('country') && (
                  <td className="px-4 py-3 text-navy-900">{sticker.country}</td>
                )}
                {columns.includes('tier') && (
                  <td className="px-4 py-3">
                    <Badge variant={sticker.tier === 'S' ? 'success' : 'info'} size="sm">
                      {sticker.tier}
                    </Badge>
                  </td>
                )}
                {columns.includes('price') && (
                  <td className="px-4 py-3 font-mono font-bold text-gold-500">
                    R$ {sticker.price.toFixed(2)}
                  </td>
                )}
                {columns.includes('change') && (
                  <td className={`px-4 py-3 font-bold ${
                    sticker.change > 0 ? 'text-success' : 'text-error'
                  }`}>
                    {sticker.change > 0 ? '↑' : '↓'} {Math.abs(sticker.change).toFixed(1)}%
                  </td>
                )}
                {columns.includes('actions') && (
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary">
                      Detalhes
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-600">
                Nenhuma figurinha encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
