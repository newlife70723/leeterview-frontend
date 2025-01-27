"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "../../../../../node_modules/next/navigation";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), { ssr: false });

interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    likes: number;
}

const EditPostPage: React.FC = () => {
    const { postId } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/articles/getCategories`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data.categories ? data.data.categories : []);
                } else {
                    console.error("Failed to fetch categories:", response.status);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories", error);
                setCategories([]);
            }
        };

        fetchData();
    }, [baseUrl]);

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
                    setTitle(data.article.title);
                    setActiveCategory(data.article.category);
                    setContent(data.article.content);
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

    const handleSubmit = async () => {
        const postData = {
            "id": postId,
            "title": title,
            "category": activeCategory,
            "content": content
        }

        try {
            const response = await fetch(`${baseUrl}/articles/editPost`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(postData),
            })

            if (response.ok) {
                toast.success("Article submitted successfully!");
            } else {
                toast.error("Article submitted failed.");
            }
        } catch (error) {
            toast.error("Article submitted failed.");
            console.error("Article submitted failed: ", error);
        }
    };

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-[90%] max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Edit your Article</h1>

                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <input
                    id="title" 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />

                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Algorithm Category
                </label>
                <select
                    id="category"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>
                        Choose a category
                    </option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <div className="mt-4">
                    <MarkdownEditor content={content} onChange={setContent} />
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                >
                    Submit Article
                </button>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    )
}

export default EditPostPage;