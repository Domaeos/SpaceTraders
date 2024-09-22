import { IUser } from "@/Types/types";

export default function getCurrentUserFromStorage() {
    const stored = localStorage.getItem("currentUser");
    return JSON.parse(stored || "{}") as IUser;
}