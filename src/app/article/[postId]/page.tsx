"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "../../../../node_modules/next/navigation";

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
    const [editable, setEditable] = useState<boolean>(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter(); 

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
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const { data } = await response.json(); 
                    setArticle(data.article);
                    setEditable(data.article.editable);
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

    const onEdit = () => {
        router.push(`/article/edit/${postId}`);
    }

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-[90%] max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{article.title}</h1>
                    {editable && (
                        <button
                        onClick={onEdit} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                            Edit
                        </button>
                    )}
                </div>
                
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
