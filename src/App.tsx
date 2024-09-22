import "@/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import NewGame from "@/Components/NewGame";
import { UserContext } from "@/Contexts/UserContext";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Navigation } from "@/Components/NavBar";
import { Route, Routes } from "react-router-dom";
import { ListAgents } from "@/Components/ListAgents";
import ShipNavigation from "@/Pages/ShipNavigation";
import Contracts from "@/Pages/Contracts";

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navigation />
      <div className="page-display">
      <Routes>
        <Route path="/" element=<NewGame /> />
        <Route path="/agents" element=<ListAgents /> />
        {user && <Route path="/navigation" element=<ShipNavigation /> />}
        {user && <Route path="/contracts" element=<Contracts /> />}
      </Routes>
      </div>
      <Toaster position="bottom-center"/>
    </>
  );
}

export default App;