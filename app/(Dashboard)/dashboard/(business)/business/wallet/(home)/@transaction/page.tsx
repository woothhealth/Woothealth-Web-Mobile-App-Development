"use client";

import React, { useEffect, useState } from "react";
import { useDashboardUser } from "@/Components/DashboardUserProvider";
import { useTransactionRefresh } from "@/Components/TransactionRefreshContext";
import TransactionClient from "./TransactionClient";

const Page = () => {
  const user = useDashboardUser();
  const { refreshTrigger } = useTransactionRefresh();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `/api/wallet/transactions?userId=${user.id}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const result = await res.json();
        if (isMounted) {
          // Handle both backend response and mock data formats
          const transactions = result?.data || result || [];
          setData(Array.isArray(transactions) ? transactions : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load transactions");
          setData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, [user?.id, refreshTrigger]);

  if (error) return <div className="text-red-500">{error}</div>;
  return <TransactionClient data={data} loading={loading} error={error} />;
};

export default Page;