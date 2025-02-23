import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../utils/axios";

const LoginForm = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        axiosInstance.post("/superadmin/login", {
            phone_number: phoneNumber,
            password,
        })
            .then((response) => {
                const data = response.data;
                if (data.token) {
                    localStorage.setItem("token_superadmin", data.token);
                    localStorage.setItem("id_superadmin", data.admin._id);
                    navigate("/");
                } else {
                    toast.error(data.error || "Login failed");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error("Login failed");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                <div className="mb-4">
                    <label htmlFor="phone-number" className="block text-gray-700 font-medium mb-2">
                        Phone Number
                    </label>
                    <input
                        id="phone-number"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border-none outline-none rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
                        placeholder="Enter phone number"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-none outline-none rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
                        placeholder="Enter password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[var(--green)] text-white font-bold py-2 px-4 rounded hover:opacity-90"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
