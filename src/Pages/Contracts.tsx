import { fetchContracts } from "@/API/fetchContracts";
import { ContractCard } from "@/Components/ContractCard";
import { UserContext } from "@/Contexts/UserContext";
import { useContext, useMemo, useState } from "react"
import { IContract } from '@/Types/types';
import { Spinner } from "react-bootstrap";

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

  if (isLoading) return <Spinner animation="border" variant="primary" />

  return (
    <>
    {contracts.map((contract) => (<ContractCard setRefresh={setRefresh} contract={contract} key={contract.id} />))}
    </>
  )
}