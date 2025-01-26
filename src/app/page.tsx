"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchPopup from "@/components/SearchPopup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// 導航數據
const navData = [
    {
        name: "Article",
        link: "/article",
        subcategories: [],
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

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    likes: number;
}

const Home = () => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // 點擊 Compose 按鈕邏輯
    const handleComposeBtn = () => {
        if (isLoggedIn) {
            router.push("/article/compose");
        } else {
            router.push("/login");
        }
    };

    // 點擊文章進行導航
    const handleArticleClick = (id: number) => {
        router.push(`/article/${id}`); // 跳轉到 `/article/[id]`
    };

    // 獲取熱門文章
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    category: "",
                    titleKeyword: "",
                    pageNumber: "1",
                    pageSize: "20",
                }).toString();

                const response = await fetch(`${baseUrl}/articles/getPosts?${queryParams}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const normalizedArticles = data?.data?.articles.map((article: Article) => ({
                        ...article,
                        likes: article.likes ?? 0,
                    }));
                    setArticles(normalizedArticles || []);
                } else {
                    console.error("Failed to fetch articles:", response.status);
                    setArticles([]);
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [baseUrl]);

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
                <aside className="md:w-1/6 bg-transparent p-0 rounded-lg shadow-none flex flex-col space-y-4">
                    <button
                        className="w-full p-4 rounded-lg bg-gray-500 text-white uppercase text-xl font-extrabold"
                        onClick={handleComposeBtn}
                    >
                        Compose
                    </button>
                    <Navbar items={navData} onAction={(action) => setIsSearchOpen(action === "openSearch")} />
                </aside>

                {/* 右側熱門文章區域 */}
                <section className="md:w-5/6 bg-white p-6 rounded-lg shadow-lg h-full">
                    <h2 className="text-4xl font-extrabold text-left text-gray-800 mb-6">
                        Trending Posts
                    </h2>
                    <ul className="space-y-4">
                        {articles.map((article) => (
                            <li
                                key={article.id}
                                className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleArticleClick(article.id)} // 使用 handleArticleClick
                            >
                                <h3 className="text-2xl font-bold text-blue-500 hover:underline">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 mt-2">{article.content}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            {/* 搜索彈窗 */}
            {isSearchOpen && (
                <SearchPopup onClose={() => setIsSearchOpen(false)}/>
            )}
        </div>
    );
};

export default Home;
