"use client";

import React from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  const handleLogin = (username: string, password: string) => {
    console.log("Logging in with:", username, password);
  };

  const handleRegister = (username: string, password: string, email: string) => {
    console.log("Register in with:", username, password, email);
  }

  return (
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
        <LoginForm onLogin={handleLogin} onRegister={handleRegister}/>
      </div>
    </div>
  );
};

export default LoginPage;
