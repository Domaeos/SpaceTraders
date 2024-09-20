import { createContext, useState } from "react";
import { ReactNode } from "react";
import { IUser } from "@/Types/types";

export const UserContext = createContext<{
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};