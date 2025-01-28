"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    likes: number;
}

const MyArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Loading 狀態
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!baseUrl) {
            console.error("API URL is missing!");
            return;
        }

        const getPosts = async () => {
            setLoading(true);
            const userId = localStorage.getItem("userId") ?? "";

            const queryParams = new URLSearchParams({
                userId,
                pageNumber: "1",
                pageSize: "20",
            }).toString();

            try {
                const response = await fetch(`${baseUrl}/articles/getPosts?${queryParams}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const { data } = await response.json();
                    setArticles(data.articles);
                } else {
                    console.error("Failed to fetch articles");
                }
            } catch (error) {
                console.error("Error fetching articles", error);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        getPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-[90%] max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">My Articles</h1>

                {loading ? (
                    <div className="flex justify-center items-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="text-gray-600 ml-2">Loading...</p>
                    </div>
                ) : articles.length > 0 ? (
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
                                    <span>Likes: {article.likes ? article.likes : 0}</span>
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
        </div>
    );
};

export default MyArticlesPage;
