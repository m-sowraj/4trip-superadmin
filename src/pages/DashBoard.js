import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/SideBar'
import Header from '../components/Header'
import AgentsTable from './Agents/AgentsTable';
import PartnersTable from './Partners/Partners';
import ReviewPage from './ReviewRegisteration/ReviewPage';
import Carry from './Carry/Carry';
import Destination from './Destination/Destination';
import LoginForm from './Login/Login';
import CreateLocation from './Locations/CreateLocation';
import EditLocation from './Locations/EditLocation';
import DeleteLocation from './Locations/DeleteLocation';
import ViewLocation from './Locations/ViewLocation';
import ListLocations from './Locations/ListLocations';

function DashBoard() {
    return (
    <div className="flex flex-col min-h-screen max-h-screen">
      <Header /> 
      <div className="flex-1 flex bg-gray-100">
        <Sidebar className="flex-1" />
        <div className="py-6 px-10 w-full">
            <Routes>
                <Route path="/agents" element={<AgentsTable />} />
                <Route path="/partners" element={<PartnersTable />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/carry" element={<Carry />} />
                <Route path="/destinations" element={<Destination />} />
                <Route path="/locations" element={<ListLocations />} />
                <Route path="/locations/create" element={<CreateLocation />} />
                <Route path="/locations/edit/:id" element={<EditLocation />} />
                <Route path="/locations/delete/:id" element={<DeleteLocation />} />
                <Route path="/locations/view/:id" element={<ViewLocation />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/login" element={<LoginForm />} />
            </Routes>
        </div>
      </div>
    </div>
  )
}

function Home() {
    return <div>Welcome to the Dashboard</div>
}

function Payments() {
    return <div>Payments Page </div>
}

export default DashBoard
