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
      <div className="flex-1">
        <Link href="/">
          <p className="text-xl font-bold hover:text-gray-400">Leetrview</p>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
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
              className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <p className="bg-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
              Login
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopBar;
