import { IUser } from "@/Types/types";
import { getUsersFromStorage } from "./getUsersFromStorage";

export function addUserToStorage(data: IUser) {
  const currentStored = getUsersFromStorage();
  const newData = JSON.stringify([...currentStored, data]);
  localStorage.setItem("users", newData);
}