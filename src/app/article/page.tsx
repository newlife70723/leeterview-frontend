"use client";
import React, { useState } from "react";

const categories = ["All", "Array", "String", "DP", "Graph", "Test1"];

const ArticlePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      {/* 類別選擇區域 */}
      <div className="w-full bg-gray-800 text-white h-16 shadow-md flex items-center px-6 sticky top-0 z-40">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-semibold ${
                activeCategory === category
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 搜尋欄 */}
      <div className="flex items-center space-x-4 bg-gray-100 h-14 w-full shadow-md px-6 mt-4">
        <p className="font-semibold text-gray-700">Search:</p>
        <input
          type="text"
          placeholder="Search articles..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
          Search
        </button>
      </div>

      {/* 主内容区 */}
      <div className="px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Articles in {activeCategory}
        </h2>
        {/* 示例文章列表 */}
        <ul className="space-y-4">
          <li className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-blue-500 hover:underline">
              How to Use Arrays in JavaScript
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              A beginners guide to arrays in JavaScript.
            </p>
          </li>
          <li className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-blue-500 hover:underline">
              Understanding Dynamic Programming
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              A step-by-step introduction to solving DP problems.
            </p>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ArticlePage;
