"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArticlePage: React.FC = () => {
    const { postId } = useParams(); 
    const [article, setArticle] = useState<any | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!postId) {
            console.error("Post ID is missing.");
            return;
        }

        const fetchArticle = async () => {
            try {
                const response = await fetch(`${baseUrl}/articles/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const { data } = await response.json(); // 確保返回的數據格式正確
                    setArticle(data.article); // 確保提取正確層次的數據
                } else {
                    const errorResponse = await response.json();
                    toast.error(errorResponse.message || "Article not found!");
                }
            } catch (error) {
                console.error("Error fetching article:", error);
                toast.error("Error loading the article.");
            }
        };

        fetchArticle();
    }, [postId, baseUrl]);

    if (!article) {
        return <p>Loading...</p>; // 如果文章數據為 null，顯示 Loading
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-[90%] max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
                <p className="text-sm text-gray-500 mb-4">Category: {article.category}</p>
                <div className="prose max-w-none">
                    <p>{article.content}</p>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ArticlePage;
