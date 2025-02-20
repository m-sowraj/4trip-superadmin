import { Bell, Settings } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navi = useNavigate()
  return (
    <div className="bg-[#F5F6FA]">
      <div className="flex-1 py-3 px-4 bg-[var(--green)] ">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <div
              onClick={() => navi("/")}
              className="cursor-pointer flex items-center space-x-2 px-2 py-1 text-md bg-white rounded-md"
            >
              <span>Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
