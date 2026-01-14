import { api } from "./client";

export const getUserById = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const getUserByEmail = async (email: string) => {
  const res = await api.get(`/users?email=${email}`);
  return res.data[0];
};