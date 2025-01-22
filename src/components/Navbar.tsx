"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMedia } from "use-media";

// 定義導航項目的結構
interface NavItem {
  name: string;
  link?: string;
  action?: string;
  subcategories?: NavItem[];
}

interface NavbarProps {
  items: NavItem[];
  onAction?: (actionName: string) => void; // 父組件傳入的回調函數，用於處理事件
}

const Navbar: React.FC<NavbarProps> = ({ items, onAction }) => {
    const [openItem, setOpenItem] = useState<string | null>(null); // 當前展開的菜單
    const [menuOpen, setMenuOpen] = useState(false); // 手機版漢堡菜單狀態
    const isMobile = useMedia({ maxWidth: 767 });
  
    const toggleSubmenu = (itemName: string) => {
      setOpenItem(openItem === itemName ? null : itemName);
    };
  
    const handleItemClick = (item: NavItem, event: React.MouseEvent) => {
      event.stopPropagation();
  
      if (item.subcategories && item.subcategories.length > 0) {
        toggleSubmenu(item.name);
      } else if (item.action && onAction) {
        onAction(item.action);
      } else if (item.link) {
        // 跳轉並收起菜單（手機版）
        window.location.href = item.link;
        setMenuOpen(false);
      }
    };
  
    const renderNavItems = (items: NavItem[]) => {
      return (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="relative">
              <div
                className="flex items-center cursor-pointer hover:text-blue-400"
                onClick={(event) => handleItemClick(item, event)}
              >
                {item.link ? (
                  <Link href={item.link}>
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ) : (
                  <span className="text-lg">{item.name}</span>
                )}
              </div>
  
              {item.subcategories && openItem === item.name && (
                <ul className="bg-gray-700 text-white rounded-lg shadow-md w-full p-4 mt-2 space-y-2">
                  {item.subcategories.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={subItem.link || "#"}
                        className="hover:text-blue-400"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );
    };
  
    return (
      <nav className="bg-gray-800 text-white p-4 rounded-lg">
        {isMobile ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                className="text-white focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
            {menuOpen && <div className="mt-4">{renderNavItems(items)}</div>}
          </>
        ) : (
          <div>{renderNavItems(items)}</div>
        )}
      </nav>
    );
  };
  
  export default Navbar;
  