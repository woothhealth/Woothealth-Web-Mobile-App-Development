import { useState, useEffect, useRef } from 'react';

type PaCode = {
  id: string;
  authorizationCode: string;
  createdDate: string;
  providerName: string;
  patientId: string;
  status: 'approved' | 'under review' | 'declined';
  [key: string]: any;
};

// In-memory cache for PA codes
const paCodeCache = new Map<string, { data: PaCode | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UsePaCodeDataResult {
  data: PaCode | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and cache individual PA code data
 * @param paCodeId - The ID of the PA code to fetch
 * @param options - Configuration options
 * @returns Object with data, loading, error states and refetch function
 */
export function usePaCodeData(
  paCodeId: string | null,
  options: { useCache?: boolean; cacheTTL?: number } = {}
): UsePaCodeDataResult {
  const { useCache = true, cacheTTL = CACHE_TTL } = options;
  const [data, setData] = useState<PaCode | null>(null);
  const [loading, setLoading] = useState(!!paCodeId);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    if (!paCodeId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPaCode = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        if (useCache) {
          const cached = paCodeCache.get(paCodeId);
          if (cached && Date.now() - cached.timestamp < cacheTTL) {
            console.log(`[Cache HIT] PA Code ${paCodeId}`);
            setData(cached.data);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        console.log(`[Fetching] PA Code ${paCodeId}`);
        const res = await fetch(`/api/admin/pa-codes?paCodeId=${paCodeId}`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const responseData = await res.json();
        const paCode = responseData?.data || responseData;

        if (!paCode || typeof paCode !== 'object') {
          throw new Error('Invalid PA code data format');
        }

        const normalized: PaCode = {
          id: paCode.$id || paCode.id || paCodeId,
          authorizationCode: paCode.authorizationCode || '',
          createdDate: paCode.createdDate || '',
          providerName: paCode.providerName || '',
          patientId: paCode.patientId || '',
          status: (paCode.status || 'under review') as PaCode['status'],
          ...paCode, // Include all other fields
        };

        // Update cache
        if (useCache) {
          paCodeCache.set(paCodeId, { data: normalized, timestamp: Date.now() });
        }

        setData(normalized);
        retryCountRef.current = 0;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[Error] Fetching PA Code ${paCodeId}:`, errorMessage);

        // Retry logic
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          console.log(`[Retry ${retryCountRef.current}/${MAX_RETRIES}] Fetching PA Code ${paCodeId}`);
          setTimeout(fetchPaCode, 1000 * retryCountRef.current); // Exponential backoff
          return;
        }

        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaCode();
  }, [paCodeId, useCache, cacheTTL]);

  const refetch = () => {
    if (paCodeId) {
      paCodeCache.delete(paCodeId);
      retryCountRef.current = 0;
      setLoading(true);
    }
  };

  return { data, loading, error, refetch };
}

/**
 * Clear the PA code cache (useful for manual data refresh)
 */
export function clearPaCodeCache() {
  paCodeCache.clear();
  console.log('[Cache] Cleared PA code cache');
}

/**
 * Preload a PA code into the cache
 */
export async function preloadPaCode(paCodeId: string): Promise<PaCode | null> {
  try {
    const res = await fetch(`/api/admin/pa-codes?paCodeId=${paCodeId}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to preload PA code');

    const responseData = await res.json();
    const paCode = responseData?.data || responseData;

    if (paCode) {
      paCodeCache.set(paCodeId, { data: paCode, timestamp: Date.now() });
      return paCode;
    }
  } catch (err) {
    console.error(`[Preload Error] PA Code ${paCodeId}:`, err);
  }

  return null;
}
