"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchPopup from "../components/SearchPopup";

// 導航數據
const navData = [
  {
    name: "Categories",
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

// 測試用文章數據
const articles = [
  {
    id: "1",
    title: "How to Use Arrays in JavaScript",
    description: "A beginner's guide to arrays in JavaScript.",
    url: "/articles/arrays-in-js",
  },
  {
    id: "2",
    title: "Understanding String Methods",
    description: "Learn how to manipulate strings effectively.",
    url: "/articles/string-methods",
  },
  {
    id: "3",
    title: "Dynamic Programming for Beginners",
    description: "An introduction to solving problems using DP.",
    url: "/articles/dynamic-programming",
  },
];

const Home = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 控制搜索框顯示

  // 處理導航操作
  const handleNavAction = (actionName: string) => {
    const actions = {
      openSearch: () => setIsSearchOpen(true), // 打開搜索彈窗
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
      <header className="w-full text-white p-12">
        <h1 className="text-6xl font-extrabold text-left text-shadow-custom cursor-pointer">
          Leeterview
        </h1>
        <p className="text-xl font-semibold mt-4 text-white bg-clip-text bg-gradient-to-r from-black via-gray-600 to-gray-800 text-shadow-custom">
          Share your LeetCode solutions and earn points!
        </p>
      </header>

      {/* 主要內容區域 */}
      <main className="flex flex-col md:flex-row p-6 gap-6">
        {/* 左側導航欄 */}
        <aside className="md:w-1/6 bg-transparent p-0 rounded-lg shadow-none">
          <Navbar items={navData} onAction={handleNavAction} />
        </aside>

        {/* 右側熱門文章區域 */}
        <section className="md:w-5/6 bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-4xl font-extrabold text-left text-gray-800 mb-6">
            Trending Posts
          </h2>
          <ul className="space-y-4">
            {articles.map((article) => (
              <li key={article.id} className="p-4 border-b border-gray-200">
                <a href={article.url} className="text-2xl font-bold text-blue-500 hover:underline">
                  {article.title}
                </a>
                <p className="text-gray-600 mt-2">{article.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* 搜索彈窗 */}
      {isSearchOpen && (
        <SearchPopup
          items={articles} // 使用文章數據作為搜索內容
          onClose={() => setIsSearchOpen(false)} // 關閉搜索框
        />
      )}
    </div>
  );
};

export default Home;
