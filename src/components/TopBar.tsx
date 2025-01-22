"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface TopBarProps {
  isLoggedIn: boolean;
  userAvatar: string;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isLoggedIn, userAvatar, onLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white h-16 shadow-md flex items-center px-4 z-50">
      {/* Logo 部分 */}
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold hover:text-gray-400 cursor-pointer">
          Leeterview
        </Link>
      </div>

      {/* 登錄區域 */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <LoggedInSection userAvatar={userAvatar} onLogout={onLogout} />
        ) : (
          <Link href="/login">
            <button className="bg-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 cursor-pointer">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

// 已登錄狀態部分
const LoggedInSection: React.FC<{ userAvatar: string; onLogout: () => void }> = ({
  userAvatar,
  onLogout,
}) => {
  return (
    <>
      <Image
        src={userAvatar}
        alt="User Avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
      <button
        onClick={onLogout}
        className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 cursor-pointer"
      >
        Logout
      </button>
    </>
  );
};

export default TopBar;
