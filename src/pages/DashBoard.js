import React, { useState } from 'react'
import Sidebar from '../components/SideBar'
import Header from '../components/Header'
import AgentsTable from './Agents/AgentsTable';
import PartnersTable from './Partners/Partners';
import ReviewPage from './ReviewRegisteration/ReviewPage';
import Carry from './Carry/Carry';
import Destination from './Destination/Destination';

function DashBoard() {
    const [active, setActive] = useState("home");
    return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
      <Header /> 
      <div className="flex-1 flex bg-gray-100">
        <Sidebar className="flex-1" active={active} setActive={setActive} />
        <div className="py-6 px-10 w-full">
            { active == "agents" ? <AgentsTable /> : null }        
            { active == "partners" ? <PartnersTable /> : null }        
            { active == "review" ? <ReviewPage /> : null }        
            { active == "carry" ? <Carry /> : null }        
            { active == "destinations" ? <Destination /> : null }        
        </div>
      </div>
    </div>
  )
}

export default DashBoard
