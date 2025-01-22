"use client";

import React, { useState } from "react";

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface SearchPopupProps {
  items: Article[]; // 搜索數據來源
  onClose: () => void; // 關閉搜索框的回調函數
}

const SearchPopup: React.FC<SearchPopupProps> = ({ items, onClose }) => {
  const [searchQuery, setSearchQuery] = useState(""); // 搜索輸入狀態

  // 動態篩選符合條件的文章
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* 搜索框標題和關閉按鈕 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Articles</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* 搜索輸入框 */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 更新搜索輸入
          placeholder="Type to search articles..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        {/* 搜索結果列表 */}
        <ul className="mt-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li key={item.id} className="mb-2">
                <a
                  href={item.url}
                  className="text-blue-500 hover:underline"
                >
                  <h3>{item.title}</h3>
                </a>
                <p className="text-sm text-gray-600">{item.description}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No results found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchPopup;
