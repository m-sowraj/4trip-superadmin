import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Phone number:", phoneNumber);
    console.log("Password:", password);

    fetch("https://fourtrip-server.onrender.com/api/superadmin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber, // Remove first 2 numbers
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          localStorage.setItem("token_superadmin", data.token);
          localStorage.setItem("superadmin_id", data.admin.superadmin_id);
          navigate("/");
        }
        else{
            toast.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="min-h-screen max-h-screen">
      <ToastContainer />
      <div className="bg-[var(--green)] w-full min-h-[3em]"></div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center h-screen"
      >
        <div className="mb-4 w-full max-w-xs">
          <label
            htmlFor="phone-number"
            className="block text-gray-700 font-medium mb-2"
          >
            Enter your phone number
          </label>
          <PhoneInput
            id="phone-number"
            country={"in"}
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputClass="rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
          />
        </div>
        <div className="mb-6 w-full max-w-xs ">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Enter your password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-none outline-none rounded-md px-3 py-2 w-full bg-[var(--sandal)]"
          />
        </div>
        <button
          type="submit"
          className="max-w-xs w-full bg-[var(--green)] text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
