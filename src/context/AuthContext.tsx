"use client"; // 確保這是客戶端組件

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 定義 AuthContext 的型別
interface AuthContextType {
  isLoggedIn: boolean;
  userAvatar: string;
  login: (token: string, avatar: string, message: string) => void;
  logout: () => void;
  register: (success: boolean, message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/images/customer.webp");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const avatar = localStorage.getItem("avatar");
    if (token) {
      setIsLoggedIn(true);
      setUserAvatar(avatar || "/images/customer.webp"); // 頭像如果有就顯示，沒有則使用預設
    }
  }, []);

  const login = (token: string, avatar: string, message: string) => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("avatar", avatar);
      setIsLoggedIn(true);
      setUserAvatar(avatar);
      toast.success(message);
    } else {
      toast.error(message);
    }
    
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    setIsLoggedIn(false);
    setUserAvatar("/images/customer.webp");
    toast.success("Logout success");
  };

  const register = (success: boolean, message: string) => {
    if (success) {
      // 以後可添加邏輯
      toast.success(message);
    } else {
      // 以後可添加邏輯
      toast.error(message);
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userAvatar, login, logout, register }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </AuthContext.Provider>
  );
};
