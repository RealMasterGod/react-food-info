import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="h-screen w-screen overflow-x-hidden relative">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
