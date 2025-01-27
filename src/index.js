import React, {  } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from './pages/Login/Login';
import DashBoard from './pages/DashBoard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DashBoard />,
    },
    {
        path: '/login',
        element: <LoginForm/>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// reportWebVitals();