"use client";

import React from "react";

interface SearchPopupProps {
  onClose: () => void; // 用於關閉彈窗的回調函數
}

const SearchPopup: React.FC<SearchPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* 標題和關閉按鈕 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose} // 點擊關閉彈窗
          >
            ✕
          </button>
        </div>

        {/* 搜尋框輸入 */}
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full border border-gray-300 rounded-lg p-2"
          disabled // 禁用輸入框
        />

        {/* 搜尋結果 */}
        <div className="mt-4">
          <p className="text-gray-500">No results yet (functionality disabled).</p>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
