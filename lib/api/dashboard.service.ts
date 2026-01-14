import { api } from "./client";

export const getDashboardOverview = async (userId: string) => {
  const res = await api.get(`/dashboardOverview?userId=${userId}`);
  return res.data[0];
};