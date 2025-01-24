"use client";

import React, { useState } from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../context/AuthContext"; 

const LoginPage = () => {
  const { login, register } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isLoginMode, setIsLoginMode] = useState(true);

  //login logic
  const handleLogin = async (username: string, password: string) => {
    const payload = {
      "username": username,
      "password": password,
    }

    try {
      const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      if (response.ok) {
        const data = JSON.parse(responseText);
        login(data.data.token, "/images/customer.webp", data.message);
        setTimeout(() => window.history.back(), 3000);
        
      } else {
        const error = JSON.parse(responseText);
        login("", "/images/customer.webp", error.message);
      }

    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // register logic
  const handleRegister = async (username: string, password: string, email: string) => {
    const payload = {
      "username": username,
      "password": password,
      "email": email,
    };

    try {
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text(); 
      if (response.ok) {
        const data = JSON.parse(responseText);
        register(true, data.message);
        setIsLoginMode(true);
      } else {
        const error = JSON.parse(responseText);
        register(false, error.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };


  return (
    <>
      <div className="flex flex-col items-center justify-begin min-h-screen bg-gray-100">
        {/* 圖標與標題區域 */}
        <div className="text-center mb-6">
          <div className="w-[150px] h-[150px] mx-auto">
            <Image
              src="/images/leeterview_icon.png"
              alt="Leeterview Icon"
              width={150}
              height={150}
              className="rounded-full object-contain"
            />
          </div>
        </div>

        {/* 登入表單區域 */}
        <div className="w-full max-w-sm rounded-lg p-6">
          <LoginForm 
          onLogin={handleLogin} 
          onRegister={handleRegister}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
          />
        </div>
      </div>
    </>
    
  );
};

export default LoginPage;
