"use client";

import React, { useEffect, useState } from "react";
import { getTransaction } from "@/lib/transaction";
import TransactionClient from "./TransactionClient";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const result = await getTransaction();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError("Failed to load transactions");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return <TransactionClient data={data} />;
};

export default Page;