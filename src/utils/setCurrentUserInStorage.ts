import { IUser } from '@/Types/types';

export default function setCurrentUserInStorage(user: IUser) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}