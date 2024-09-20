import "./App.css";
import NewGame from "./NewGame";
import { UserContext } from "./Contexts/UserContext";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <h1>STQS</h1>
      <NewGame />
      <Toaster />
    </>
  );
}

export default App;
