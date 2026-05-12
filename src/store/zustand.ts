/* ========== ZUSTAND STORE ========== */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==================== TYPES ====================
export interface Sticker {
  id: number;
  ticker: string;
  name: string;
  country: string;
  flag: string;
  group: string;
  position: string;
  tier: 'S' | 'A' | 'B' | 'C';
  price: number;
  change: number;
  volume: number;
}

export interface UserSticker {
  stickerId: number;
  has: boolean;
  want: boolean;
  trade: boolean;
  quantity: number;
  addedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'price_drop' | 'trade_offer' | 'friend_activity' | 'system';
  title: string;
  message: string;
  relatedStickerId?: number;
  isRead: boolean;
  createdAt: string;
}

// ==================== AUTH STORE ====================
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, error: null })
    }),
    { name: 'auth-store' }
  )
);

// ==================== COLLECTION STORE ====================
interface CollectionState {
  stickers: Map<number, UserSticker>;
  allStickers: Sticker[];
  isLoading: boolean;
  addSticker: (stickerId: number, quantity: number) => void;
  removeSticker: (stickerId: number) => void;
  markAsHaving: (stickerId: number, value: boolean) => void;
  markAsWanting: (stickerId: number, value: boolean) => void;
  markAsTrading: (stickerId: number, value: boolean) => void;
  setAllStickers: (stickers: Sticker[]) => void;
  setLoading: (loading: boolean) => void;
  getOwnedStickers: () => UserSticker[];
  getWantedStickers: () => UserSticker[];
  getTradingStickers: () => UserSticker[];
  getMissingStickers: () => Sticker[];
  getCompletionPercentage: () => number;
  getPortfolioValue: () => number;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      stickers: new Map(),
      allStickers: [],
      isLoading: false,

      addSticker: (stickerId, quantity = 1) =>
        set(state => {
          const newStickers = new Map(state.stickers);
          const existing = newStickers.get(stickerId);
          newStickers.set(stickerId, {
            stickerId,
            has: true,
            want: false,
            trade: quantity > 1,
            quantity: (existing?.quantity || 0) + quantity,
            addedAt: new Date().toISOString()
          });
          return { stickers: newStickers };
        }),

      removeSticker: (stickerId) =>
        set(state => {
          const newStickers = new Map(state.stickers);
          newStickers.delete(stickerId);
          return { stickers: newStickers };
        }),

      markAsHaving: (stickerId, value) =>
        set(state => {
          const newStickers = new Map(state.stickers);
          const sticker = newStickers.get(stickerId) || {
            stickerId,
            has: false,
            want: false,
            trade: false,
            quantity: 1,
            addedAt: new Date().toISOString()
          };
          if (!value) {
            sticker.trade = false;
          }
          sticker.has = value;
          newStickers.set(stickerId, sticker);
          return { stickers: newStickers };
        }),

      markAsWanting: (stickerId, value) =>
        set(state => {
          const newStickers = new Map(state.stickers);
          const sticker = newStickers.get(stickerId) || {
            stickerId,
            has: false,
            want: false,
            trade: false,
            quantity: 1,
            addedAt: new Date().toISOString()
          };
          sticker.want = value;
          newStickers.set(stickerId, sticker);
          return { stickers: newStickers };
        }),

      markAsTrading: (stickerId, value) =>
        set(state => {
          const newStickers = new Map(state.stickers);
          const sticker = newStickers.get(stickerId);
          if (sticker && sticker.has) {
            sticker.trade = value;
            newStickers.set(stickerId, sticker);
          }
          return { stickers: newStickers };
        }),

      setAllStickers: (stickers) => set({ allStickers: stickers }),
      setLoading: (loading) => set({ isLoading: loading }),

      getOwnedStickers: () => {
        const stickers = get().stickers;
        return Array.from(stickers.values()).filter(s => s.has);
      },

      getWantedStickers: () => {
        const stickers = get().stickers;
        return Array.from(stickers.values()).filter(s => s.want);
      },

      getTradingStickers: () => {
        const stickers = get().stickers;
        return Array.from(stickers.values()).filter(s => s.trade);
      },

      getMissingStickers: () => {
        const allStickers = get().allStickers;
        const ownedIds = get().getOwnedStickers().map(s => s.stickerId);
        return allStickers.filter(s => !ownedIds.includes(s.id));
      },

      getCompletionPercentage: () => {
        const allStickers = get().allStickers;
        const owned = get().getOwnedStickers().length;
        return allStickers.length > 0 ? (owned / allStickers.length) * 100 : 0;
      },

      getPortfolioValue: () => {
        const owned = get().getOwnedStickers();
        const allStickers = get().allStickers;
        return owned.reduce((total, sticker) => {
          const stickerData = allStickers.find(s => s.id === sticker.stickerId);
          return total + (stickerData?.price || 0) * sticker.quantity;
        }, 0);
      }
    }),
    { name: 'collection-store' }
  )
);

// ==================== NOTIFICATION STORE ====================
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set(state => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        isRead: false
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    }),

  removeNotification: (id) =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),

  markAsRead: (id) =>
    set(state => {
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        return {
          notifications: [...state.notifications],
          unreadCount: Math.max(0, state.unreadCount - 1)
        };
      }
      return state;
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.isRead).length;
  }
}));

// ==================== UI STORE ====================
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'dark',
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme })
    }),
    { name: 'ui-store' }
  )
);

// ==================== COMBINED HOOK ====================
export const useAppState = () => ({
  auth: useAuthStore(),
  collection: useCollectionStore(),
  notifications: useNotificationStore(),
  ui: useUIStore()
});
