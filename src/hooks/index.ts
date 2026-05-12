/* ========== CUSTOM HOOKS ========== */

import { useState, useCallback, useEffect } from 'react';
import { useAuthStore, useCollectionStore, useNotificationStore } from './04-store-zustand';

// ==================== useAuth HOOK ====================
export const useAuth = () => {
  const { user, setUser, setLoading, setError, logout } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoggingIn(true);
    setError(null);
    try {
      // Simulação de login (substituir por chamada real da API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser({
        id: Math.random().toString(36).substring(7),
        username: email.split('@')[0],
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [setUser, setError]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setUser({
        id: Math.random().toString(36).substring(7),
        username: email.split('@')[0],
        email,
        name,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      setError('Falha ao criar conta. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [setUser, setError]);

  return {
    user,
    isLoggingIn,
    login,
    signup,
    logout
  };
};

// ==================== useCollection HOOK ====================
export const useCollection = () => {
  const collection = useCollectionStore();

  const stats = {
    owned: collection.getOwnedStickers().length,
    wanted: collection.getWantedStickers().length,
    trading: collection.getTradingStickers().length,
    missing: collection.getMissingStickers().length,
    completionPercentage: collection.getCompletionPercentage(),
    portfolioValue: collection.getPortfolioValue()
  };

  return {
    ...collection,
    stats
  };
};

// ==================== useNotifications HOOK ====================
export const useNotifications = () => {
  const notifications = useNotificationStore();
  const [toasts, setToasts] = useState<string[]>([]);

  const notify = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, id]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== id));
    }, duration);
  }, []);

  return {
    ...notifications,
    notify,
    toasts
  };
};

// ==================== useFetch HOOK ====================
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export const useFetch = <T,>(url: string, options?: FetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...(options?.body && { body: JSON.stringify(options.body) })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

// ==================== useDebounce HOOK ====================
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ==================== useLocalStorage HOOK ====================
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`useLocalStorage error for key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// ==================== usePagination HOOK ====================
interface PaginationOptions {
  itemsPerPage?: number;
}

export const usePagination = <T,>(items: T[], options?: PaginationOptions) => {
  const itemsPerPage = options?.itemsPerPage || 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

// ==================== useFilter HOOK ====================
export const useFilter = <T,>(items: T[], filterFn: (item: T) => boolean) => {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items.filter(filterFn));
  }, [items, filterFn]);

  return filteredItems;
};

// ==================== useSearch HOOK ====================
export const useSearch = <T,>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  delay?: number
) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  const results = items.filter(item => searchFn(item, debouncedQuery));

  return {
    query,
    setQuery,
    results,
    hasResults: results.length > 0,
    resultCount: results.length
  };
};

// ==================== useSort HOOK ====================
type SortOrder = 'asc' | 'desc';

export const useSort = <T,>(
  items: T[],
  sortFn: (a: T, b: T, order: SortOrder) => number
) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sorted = sortBy
    ? [...items].sort((a, b) => sortFn(a, b, sortOrder))
    : items;

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  return {
    items: sorted,
    sortBy,
    sortOrder,
    toggleSort,
    setSortBy,
    setSortOrder
  };
};

// ==================== useAsync HOOK ====================
interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) => {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null
  });

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const response = await asyncFunction();
      setState({ status: 'success', data: response, error: null });
      return response;
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};

// ==================== useForm HOOK ====================
interface FormState {
  [key: string]: string | number | boolean;
}

export const useForm = <T extends FormState>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues(prev => ({ ...prev, [name]: fieldValue }));
    if (errors[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setFieldError = (name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    resetForm,
    setErrors,
    setValues
  };
};
