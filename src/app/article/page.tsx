"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    likes: number;
}

const ArticlePage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const router = useRouter(); // 用於跳轉到動態路由

    const [criteria, setCriteria] = useState({
        category: "All",
        titleKeyword: "",
        pageNumber: 1,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${baseUrl}/articles/getCategories`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const responseText = await response.text();
                    const data = JSON.parse(responseText);
                    setCategories(["All", ...(data?.data?.categories || [])]);
                } else {
                    console.error("Failed to fetch categories:", response.status);
                    setCategories(["All"]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories(["All"]);
            }
        };

        fetchCategories();
    }, [baseUrl]);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    category: criteria.category === "All" ? "" : criteria.category,
                    titleKeyword: criteria.titleKeyword,
                    pageNumber: String(criteria.pageNumber),
                    pageSize: String(criteria.pageSize),
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
    }, [criteria, baseUrl]);

    const handleSearch = () => {
        setCriteria((prev) => ({
            ...prev,
            titleKeyword: searchKeyword,
            pageNumber: 1,
        }));
    };

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCriteria((prev) => ({
            ...prev,
            category,
            pageNumber: 1,
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="w-full bg-gray-800 text-white h-16 shadow-md flex items-center px-6 sticky top-0 z-40">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
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

            <div className="flex items-center space-x-4 bg-gray-100 h-14 w-full shadow-md px-6 mt-4">
                <p className="font-semibold text-gray-700">Search:</p>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                >
                    Search
                </button>
            </div>

            <div className="px-6 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Articles in {activeCategory}
                </h2>
                {articles.length > 0 ? (
                    <ul className="space-y-4">
                        {articles.map((article) => (
                            <li
                                key={article.id}
                                className="p-4 border border-gray-200 rounded-lg shadow-sm"
                            >
                                <h3
                                    className="text-lg font-bold text-blue-500 hover:underline cursor-pointer"
                                    onClick={() => router.push(`/article/${article.id}`)}
                                >
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">{article.content}</p>
                                <div className="text-sm text-gray-500 mt-2">
                                    <span>Category: {article.category}</span> ・{" "}
                                    <span>Likes: {article.likes}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center bg-gray-100 p-6 border border-gray-200 rounded-lg">
                        <p className="text-gray-600 text-lg">No articles found.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ArticlePage;
