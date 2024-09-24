import "@/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from "@/Contexts/UserContext";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigation } from "@/Components/NavBar";
import { Route, Routes } from "react-router-dom";
import { ListAgents } from "@/Components/ListAgents";
import ShipNavigation from "@/Pages/ShipNavigation";
import Contracts from "@/Pages/Contracts";

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import getCurrentUserFromStorage from "./utils/getCurrentUserFromStorage";
import axiosClient from "@/API/client";
import Ships from "@/Pages/Ships";
import AuthenticatedRoute from '@/Components/AuthenticatedRoutes';
TimeAgo.addDefaultLocale(en)

function App() {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const storedUser = getCurrentUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedUser.token}`;
    }
  }, [])

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