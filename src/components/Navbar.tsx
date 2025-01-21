"use client"; // 這是必須的，告訴 Next.js 這是客戶端組件

import React, { useState } from "react";
import Link from "next/link";

// 定義每個導航項目的結構
interface NavItem {
  name: string;
  link?: string;
  subcategories?: NavItem[];
}

interface NavbarProps {
  items: NavItem[];
  title?: string;  // 可選的標題屬性
}

const Navbar: React.FC<NavbarProps> = ({ items, title }) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // 切換子菜單的顯示
  const toggleSubmenu = (itemName: string) => {
    if (openItem === itemName) {
      setOpenItem(null); // 關閉子菜單
    } else {
      setOpenItem(itemName); // 展開子菜單
    }
  };

  // 處理點擊事件：有子菜單則展開，沒有則顯示 No
  const handleItemClick = (item: NavItem) => {
    if (item.subcategories && item.subcategories.length > 0) {
      toggleSubmenu(item.name); // 展開或收起子菜單
    } else if (item.link) {
      // 如果沒有子菜單，且有鏈接，則跳轉到該頁面
      window.location.href = item.link;
    } else {
      alert("No link available"); // 沒有鏈接，顯示警告
    }
  };

  // 渲染導航項目
  const renderNavItems = (items: NavItem[]) => {
    return (
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleItemClick(item)} // 點擊時觸發處理函數
            >
              <span className="text-lg hover:text-blue-400">{item.name}</span>
            </div>

            {/* 根據 openItem 展開或收起子菜單 */}
            {item.subcategories && openItem === item.name && (
              <div
                className="bg-gray-800 text-white rounded-lg shadow-md w-full p-4 mt-2 overflow-hidden"
                style={{
                  opacity: openItem === item.name ? 1 : 0, // 控制透明度
                }}
              >
                <ul className="space-y-4">
                  {item.subcategories.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <span className="text-lg">{subItem.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav
      className="bg-gray-800 text-white p-6 rounded-lg transition-all duration-300 ease-in-out"
    >
      {/* 根據 title 屬性條件渲染標題 */}
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {renderNavItems(items)}
    </nav>
  );
};

export default Navbar;

