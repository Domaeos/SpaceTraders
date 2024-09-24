import "@/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from "@/Contexts/UserContext";
import { useContext, useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { Navigation } from "@/Components/NavBar";
import { Route, Routes } from "react-router-dom";
import { ListAgents } from "@/Pages/ListAgents";
import ShipNavigation from "@/Pages/ShipNavigation";
import Contracts from "@/Pages/Contracts";

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import getCurrentUserFromStorage from "./utils/getCurrentUserFromStorage";
import axiosClient from "@/API/client";
import Ships from "@/Pages/Ships";
import AuthenticatedRoute from '@/Components/AuthenticatedRoutes';
import { ContractsContext } from "@/Contexts/ContractsContext";
import { fetchContracts } from "./API/fetchContracts";
import { logInDev } from "./utils/logInDev";
TimeAgo.addDefaultLocale(en)

function App() {
  const { user, setUser } = useContext(UserContext);
  const { setContracts } = useContext(ContractsContext)

  useEffect(() => {
    const storedUser = getCurrentUserFromStorage();
    if (storedUser?.token) {
      setUser(storedUser);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedUser.token}`;
    }
  }, [])

  useMemo(() => {

    (async () => {
      if (user?.token) {
        const contracts = await fetchContracts();
        logInDev("AppUseEffect");
        logInDev(contracts);
        if (contracts.length) {
          setContracts(contracts);
        }
      }
    })();

  }, [user]);

  return (
    <>
      <Navigation />
      <div className="page-display">
        <Routes>
          <Route path="/navigation" element={
            <AuthenticatedRoute>
              <ShipNavigation />
            </AuthenticatedRoute>
          } />
          <Route path="/contracts" element={
            <AuthenticatedRoute>
              <Contracts />
            </AuthenticatedRoute>} />
          <Route path="/ships" element={<AuthenticatedRoute><Ships /></AuthenticatedRoute>} />
          <Route path="/*" element={<ListAgents />} />
        </Routes>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;