import { useQuery } from '@tanstack/react-query';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Business API hooks
export const useBusinessOverview = () => {
  return useQuery({
    queryKey: ['business-overview'],
    queryFn: async () => {
      const res = await fetch('/api/business/overview');
      if (!res.ok) throw new Error('Failed to fetch business overview');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminOverview = () => {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await fetch('/api/admin/overview');
      if (!res.ok) throw new Error('Failed to fetch admin overview');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminEnrollees = (search = '', page = 1) => {
  return useQuery({
    queryKey: ['admin-enrollees', search, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/enrollees?search=${encodeURIComponent(search)}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch admin enrollees');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminClaims = (search = '', page = 1) => {
  return useQuery({
    queryKey: ['admin-claims', search, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/claims?search=${encodeURIComponent(search)}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch admin claims');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminWallet = (search = '', page = 1) => {
  return useQuery({
    queryKey: ['admin-wallet', search, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/wallet?search=${encodeURIComponent(search)}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch admin wallet');
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminClients = (search = '', page = 1) => {
  return useQuery({
    queryKey: ['admin-clients', search, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/clients?search=${encodeURIComponent(search)}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch admin clients');
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBusinessEmployees = (search = '', page = 1) => {
  return useQuery({
    queryKey: ['business-employees', search, page],
    queryFn: async () => {
      const res = await fetch(`/api/business/employees?search=${encodeURIComponent(search)}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Retail API hooks (add as needed)
export const useRetailOverview = () => {
  return useQuery({
    queryKey: ['retail-overview'],
    queryFn: async () => {
      const res = await fetch('/api/retail/overview'); // Assuming similar API
      if (!res.ok) throw new Error('Failed to fetch retail overview');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};