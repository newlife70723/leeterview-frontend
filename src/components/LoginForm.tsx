"use client";

import React, { useState } from "react";

interface AuthFormProps {
  onLogin: (username: string, password: string) => void; // 登录逻辑
  onRegister: (username: string, password: string, email: string) => void; // 注册逻辑
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // 控制登录/注册模式
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // 注册模式下的邮箱
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || (!isLoginMode && !email)) {
      setError("All fields are required.");
      return;
    }

    setError(null); // 清除错误

    if (isLoginMode) {
      // 登录逻辑
      onLogin(username, password);
    } else {
      // 注册逻辑
      onRegister(username, password, email);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isLoginMode ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your username"
          />
        </div>
        {!isLoginMode && (
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoginMode ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        {isLoginMode
          ? "Don't have an account? "
          : "Already have an account? "}
        <span
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          {isLoginMode ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;
