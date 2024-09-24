import { IContract } from "@/Types/types";
import { createContext, useState } from "react";
import { ReactNode } from "react";

export const ContractsContext = createContext<{
  contracts: IContract[] | null;
  setContracts: React.Dispatch<React.SetStateAction<IContract[] | null>>;
}>({
  contracts: null,
  setContracts: () => {},
});

export const ContractsProvider = ({ children }: { children: ReactNode }) => {
    const [contracts, setContracts] = useState<IContract[] | null>(null);

    return (
        <ContractsContext.Provider value={{ contracts, setContracts }}>
            {children}
        </ContractsContext.Provider>
    );
};