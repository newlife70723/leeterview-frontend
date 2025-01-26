"use client";

import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
}

interface SearchPopupProps {
    onClose: () => void; // 關閉搜索框的回調函數
}

const SearchPopup: React.FC<SearchPopupProps> = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState(""); // 搜索輸入狀態
    const [results, setResults] = useState<Article[]>([]); // 搜索結果
    const [loading, setLoading] = useState(false); // 加載狀態
    const [error, setError] = useState<string | null>(null); // 錯誤訊息
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // 搜索文章的函數
    const fetchSearchResults = async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${baseUrl}/articles/getPosts?titleKeyword=${encodeURIComponent(query)}&pageNumber=1&pageSize=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setResults(data?.data?.articles || []);
            } else {
                setError("Failed to fetch search results.");
            }
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError("An error occurred while fetching results.");
        } finally {
            setLoading(false);
        }
    };

    // 使用 debounce 限制搜索請求頻率
    const debouncedSearch = useCallback(
        debounce((query: string) => fetchSearchResults(query), 300),
        []
    );

    // 當搜索輸入發生變化時觸發請求
    useEffect(() => {
        debouncedSearch(searchQuery);

        // 清理 debounce
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                {/* 搜索框標題和關閉按鈕 */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Search Articles</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {/* 搜索輸入框 */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search articles..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />

                {/* 搜索結果列表 */}
                <ul className="mt-4">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : results.length > 0 ? (
                        results.map((item) => (
                            <li key={item.id} className="mb-2">
                                <a href={item.url} className="text-blue-500 hover:underline">
                                    <h3>{item.title}</h3>
                                </a>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </li>
                        ))
                    ) : (
                        searchQuery && <p className="text-gray-500">No results found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SearchPopup;
