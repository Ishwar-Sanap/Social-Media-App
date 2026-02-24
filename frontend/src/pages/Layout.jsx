import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import Loading from "../components/Loading";
import { Menu, X } from "lucide-react";
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = true;
  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 bg-slate-100 dark:bg-slate-800">
        <Outlet />
      </div>

      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-100  rounded-md shadow w-10 h-10 text-gray-600 dark:text-slate-400 sm:hidden bg-white dark:bg-slate-900"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-100  rounded-md shadow w-10 h-10 text-gray-600 dark:text-slate-400 sm:hidden bg-white dark:bg-slate-900"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
