"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // 動態加載
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), { ssr: false });

const ComposePage: React.FC = () => {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            toast.error("Please log in to continue.");
            router.push("/login");
        }
    }, [isLoggedIn, loading, router]);

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

    const handleSubmit = async () => {
        const postData = {
            "title": title,
            "category": activeCategory,
            "content": content
        }

        console.log(postData);

        try {
            const response = await fetch(`${baseUrl}/articles/createNewArticle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
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

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-[90%] max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Write an Article</h1>

                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your article title..."
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
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ComposePage;
