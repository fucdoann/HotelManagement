import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "../Components/layout";
import routes from "../AdminRoute";
import { useMaterialTailwindController, setOpenConfigurator } from "../Context";

export function AdminDashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
       <Outlet/>
        <div className="text-blue-gray-600">
        </div>
      </div>
    </div>
  );
}

AdminDashboard.displayName = "/src/layout/dashboard.jsx";

export default AdminDashboard;
