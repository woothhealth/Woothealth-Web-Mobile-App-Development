'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDashboardUser } from '@/Components/DashboardUserProvider';

type Wallet = {
  balance: number;
  currency: string;
};

type WalletContextType = {
  wallet: Wallet | null;
  loading: boolean;
  refreshWallet: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {

  const user = useDashboardUser();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    if (!user?.id) return;

    try {
      const endpoint = user?.role === 'business' 
        ? `/api/business/wallet` 
        : `/api/wallet?userId=${user.id}`;
      
      const res = await fetch(endpoint, {
        cache: 'no-store',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to fetch wallet');

      const data = await res.json();

      setWallet({
        balance: data?.data?.balance ?? 0,
        currency: data?.data?.currency ?? 'NGN'
      });

    } catch (error) {
      console.error('Wallet fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        refreshWallet: fetchWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used inside WalletProvider');
  }

  return context;
}