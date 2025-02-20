import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, FileText, AlertCircle, Info, Badge, PersonStanding, IndianRupee, MapPin } from "lucide-react";

const Sidebar = () => {

  const menuItems = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "agents", label: "Agents", icon: <Users className="w-5 h-5" /> },
    { id: "partners", label: "Partners", icon: <PersonStanding className="w-5 h-5" /> },
    { id: "review", label: "Review Registrations", icon: <FileText className="w-5 h-5" /> },
    { id: "payments", label: "Payments", icon: <IndianRupee className="w-5 h-5" /> },
    // { id: "alerts", label: "Send Alerts", icon: <AlertCircle className="w-5 h-5" /> },
    { id: "carry", label: "Things to Carry", icon: <Badge className="w-5 h-5" /> },
    { id: "destinations", label: "Places To Visit", icon: <Info className="w-5 h-5" /> },
    { id: "locations", label: "Locations", icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <div className="min-w-fit text-white flex flex-col items-start shadow-lg shadow-gray-500/50 ">
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.id.includes('locations') ? `/locations${item.id !== 'locations' ? `/${item.id}` : ''}` : `/${item.id}`}
            className={({ isActive }) =>
              `flex text-black items-center gap-2 px-8 py-5 ${
                isActive ? "bg-green-100 border-r-2 border-[var(--green)]" : "hover:bg-green-100"
              }`
            }
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
