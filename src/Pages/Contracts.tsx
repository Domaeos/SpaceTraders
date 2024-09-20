import { fetchContracts } from "@/API/fetchContracts";
import { ContractCard } from "@/Components/ContractCard";
import { UserContext } from "@/Contexts/UserContext";
import { useContext, useMemo, useState } from "react"
import { IContract } from '@/Types/types';

export default function Contracts() {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [refresh, setRefresh] = useState(false);

  useMemo(async () => {
    const result = await fetchContracts();
    setIsLoading(false);
    setContracts(result);
  }, [user, refresh]);

  if (isLoading) return <></>

  return (
    <>
    {contracts.map((contract) => (<ContractCard setRefresh={setRefresh} contract={contract} key={contract.id} />))}
    </>
  )
}