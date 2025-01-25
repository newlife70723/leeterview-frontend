"use client";

import React, { useState, useEffect } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 引入样式
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Next.js router 用于跳转

const ComposePage: React.FC = () => {
    const { isLoggedIn, loading } = useAuth(); // 引入 `loading` 状态
    const router = useRouter(); // 使用 Next.js 路由进行跳转
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [content, setContent] = useState<string>(""); // Markdown 内容
    const [title, setTitle] = useState<string>(""); // 标题

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
                    const responseText = await response.text();
                    const data = JSON.parse(responseText);
                    setCategories(data.data?.data || []);
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

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }
        if (!activeCategory) {
            toast.error("Please select a category.");
            return;
        }
        if (content.trim().length < 20) {
            toast.error("Content must be at least 20 characters long.");
            return;
        }

        console.log("Submitted title:", title);
        console.log("Submitted content:", content);
        console.log("Selected category:", activeCategory);
        toast.success("Article submitted successfully!");
    };

    // **延迟渲染，等待 `loading` 完成**
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null; // 防止在跳转前短暂渲染页面内容
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
            <div className="w-[90%] max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Write an Article</h1>

                {/* 标题输入框 */}
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

                {/* 类别选择 */}
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

                {/* Markdown 编辑器 */}
                <div className="mt-4">
                    <MarkdownEditor content={content} onChange={setContent} />
                </div>

                {/* 提交按钮 */}
                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                >
                    Submit Article
                </button>
            </div>

            {/* Toast 容器 */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ComposePage;
