import React from 'react'
import DashBoard from './pages/DashBoard'
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashBoard />
    </div>
  )
}
export default App