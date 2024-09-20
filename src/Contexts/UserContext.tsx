import { createContext, useState } from "react";
import { ReactNode } from "react";

interface IUser {
  symbol?: String;
  token?: String;
}

export const UserContext = createContext<{
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}>({
  user: {},
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser>({});

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};