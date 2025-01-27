import React, { useState } from "react";
import { Home, Users, FileText, AlertCircle, Info, Badge, PersonStanding, IndianRupee } from "lucide-react";

const Sidebar = ({active, setActive}) => {

  const menuItems = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "agents", label: "Agents", icon: <Users className="w-5 h-5" /> },
    { id: "partners", label: "Partners", icon: <PersonStanding className="w-5 h-5" /> },
    { id: "review", label: "Review Registrations", icon: <FileText className="w-5 h-5" /> },
    { id: "payments", label: "Payments", icon: <IndianRupee className="w-5 h-5" /> },
    { id: "alerts", label: "Send Alerts", icon: <AlertCircle className="w-5 h-5" /> },
    { id: "carry", label: "Things to Carry", icon: <Badge className="w-5 h-5" /> },
    { id: "destinations", label: "Destinations", icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <div className="min-w-fit text-white flex flex-col items-start shadow-lg shadow-gray-500/50 ">
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex text-black items-center gap-2 px-8 py-5 ${
              active === item.id ? "bg-green-100 border-r-2 border-[var(--green)]" : "hover:bg-green-100"
            }`}
            onClick={() => setActive(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
