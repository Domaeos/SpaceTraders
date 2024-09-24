import { UserContext } from "@/Contexts/UserContext";
import { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";

export default function AuthenticatedRoute({
  children,
}: {
  children: ReactElement;
}): ReactElement {

  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to={`/agents`} />;
  }

  return children;
}