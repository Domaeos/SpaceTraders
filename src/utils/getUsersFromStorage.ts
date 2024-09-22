import { IUser } from '@/Types/types';

export function getUsersFromStorage() {
  const stored = localStorage.getItem("users");
  return JSON.parse(stored || "[]") as IUser[];
}