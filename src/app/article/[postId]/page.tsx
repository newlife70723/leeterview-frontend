"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    likes: number;
}

const ArticlePage: React.FC = () => {
    const { postId } = useParams(); 
    const [article, setArticle] = useState<Article | null>(null);
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
                    const { data } = await response.json(); 
                    setArticle(data.article);
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
        return <p>Loading...</p>;
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
