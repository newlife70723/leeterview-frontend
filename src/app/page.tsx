// pages/index.tsx
"use client"
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchPopup from "../components/SearchPopup";

const navData = [
  {
    name: "Home",
    link: "/",
    subcategories: [],
  },
  {
    name: "Categories",
    link: "/categories",
    subcategories: [
      { name: "Array", link: "/categories/array" },
      { name: "String", link: "/categories/string" },
      { name: "DP", link: "/categories/dp" },
    ],
  },
  {
    name: "Search",
    action: "openSearch",
    subcategories: [],
  },
  {
    name: "Profile",
    link: "/profile",
    subcategories: [],
  },
];

const Home = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  

  const handleNavAction = (actionName: string) => {
    const actions = {
      openSearch: () => setIsSearchOpen(true),
      filterString: () => console.log("Filtering String category..."),
      filterArray: () => console.log("Filtering Array category..."),
      filterDP: () => console.log("Filtering Dynamic Programming category..."),
      showNotification: () => alert("This is a notification message!"),
    };

    if (actionName in actions) {
      actions[actionName as keyof typeof actions]();
    } else {
      console.warn(`Unknown action: ${actionName}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 標題區域 */}
      <div className="w-full text-white p-12">
        <h1 className="text-6xl font-extrabold text-left text-shadow-custom cursor-pointer">
          Leeterview
        </h1>
        <p className="text-xl font-semibold mt-4 text-white bg-clip-text bg-gradient-to-r from-black via-gray-600 to-gray-800 text-shadow-custom">
          Share your LeetCode solutions and earn points!
        </p>
      </div>

      {/* 主要內容區域 */}
      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* 左側導航欄 */}
        <div className="md:w-1/4 bg-transparent p-0 rounded-lg shadow-none">
          <Navbar items={navData} onAction={handleNavAction}/>
        </div>

        {/* 右側內容區域 */}
        <section className="md:w-3/4 bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-4xl font-extrabold text-left text-gray-800 mb-6">Trending Posts</h2>
          {/* 可放置文章列表等內容 */}

          {/* 文章內容示例 */}
          <ul className="space-y-4">
            <li className="p-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-blue-500 cursor-pointer hover:underline">
                How to Solve Two Sum Problem in JavaScript
              </h3>
              <p className="text-gray-600 mt-2">
                Learn how to efficiently solve the famous Two Sum problem on
                LeetCode with step-by-step explanations.
              </p>
            </li>
            <li className="p-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-blue-500 cursor-pointer hover:underline">
                Mastering Dynamic Programming
              </h3>
              <p className="text-gray-600 mt-2">
                A beginner's guide to understanding and solving dynamic
                programming problems.
              </p>
            </li>
          </ul>
        </section>
      </div>

      {/* 搜尋功能彈窗 */}
      {isSearchOpen && (
        <SearchPopup
          items={navData}
          onClose={() => setIsSearchOpen(false)} // 關閉搜尋框
        />
      )}
    </div>
  );
};

export default Home;
