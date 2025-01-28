"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "../../../../node_modules/next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

    const onDelete = async () => {
        try {
            const response = await fetch(`${baseUrl}/articles/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.ok) {
                router.back()
            } else {
                const errorResponse = await response.json();
                toast.error(errorResponse.message);
            }

        } catch (error) {
            console.error("Error delete article:", error);
            toast.error("Error delete the article.");
        }
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
                        <div className="flex justify-around item-center gap-1">
                            <button
                            onClick={onEdit} 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                                Edit
                            </button>
                            <button
                            onClick={() => {
                                const confirmDelete = window.confirm("Are you sure you want to delete this?");
                                if (confirmDelete) {
                                    onDelete();
                                }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
                
                <p className="text-sm text-gray-500 mb-4">Category: {article.category}</p>
                <div className="prose max-w-none">
                    {/* 渲染 Markdown */}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                    </ReactMarkdown>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ArticlePage;
