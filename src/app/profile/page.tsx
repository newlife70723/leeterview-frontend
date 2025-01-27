"use client";

import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import countries from "world-countries";
import Image from "next/image";

// 定義 Country 和 CountryOption 的型別
interface Country {
    cca2: string;
    flag: string;
    name: {
        common: string;
    };
}

interface CountryOption {
    value: string;
    label: string;
}

// 定義用戶資料的型別
interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string;
    totalPosts: number;
    totalLikes: number;
    bio: string;
    location: CountryOption;
}

const ProfilePage = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // 將國家列表轉換成 react-select 可用的格式
    const countryOptions: CountryOption[] = countries.map((country: Country) => ({
        value: country.cca2,
        label: `${country.flag} ${country.name.common}`,
    }));

    // 用戶狀態
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<UserProfile | null>(null);

    const getCountryOptionByCode = (code: string): CountryOption => {
        const country = countries.find((c) => c.cca2 === code);
        if (!country) {
            return { value: "UNKNOWN", label: "🌍 Unknown" };
        }
        return {
            value: country.cca2,
            label: `${country.flag} ${country.name.common}`,
        };
    };

    // 初始化時獲取用戶資料
    useEffect(() => {
        const GetUserProfile = async (): Promise<UserProfile> => {
            try {
                const response = await fetch(`${baseUrl}/users/getUserProfile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }
    
                const { data } = await response.json();
                const profile = data.profile;
    
                return {
                    name: profile.name || "New User",
                    email: profile.email || "example@example.com",
                    avatarUrl: profile.avatarUrl || "/images/default-avatar.png",
                    totalPosts: profile.totalPosts || 0,
                    totalLikes: profile.totalLikes || 0,
                    bio: profile.bio || "This is your bio. Click edit to update.",
                    location: getCountryOptionByCode(profile.location || "UNKNOWN"),
                };
            } catch (error) {
                console.error("Error fetching user profile:", error);
                throw error;
            }
        };

        const fetchData = async () => {
            try {
                const profile = await GetUserProfile();
                setUser(profile);
                setEditedUser(profile); // 初始化編輯狀態
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };

        fetchData();
    }, []);

    // 更新頭像
    const handleUpdateAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const file = event.target.files[0];

            try {
                const response = await fetch(
                    `${baseUrl}/s3/generateUrl?fileName=${file.name}&contentType=${file.type}`
                );

                if (!response.ok) {
                    throw new Error("Failed to get signed URL");
                }

                const { url: signedUrl } = await response.json();

                const uploadResponse = await fetch(signedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to S3");
                }

                const publicUrl = signedUrl.split("?")[0];
                const updateResponse = await fetch(`${baseUrl}/users/updateAvatar`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ avatarUrl: publicUrl }),
                });

                if (!updateResponse.ok) {
                    throw new Error("Failed to update user avatar in the backend");
                }

                setUser((prev) => (prev ? { ...prev, avatarUrl: publicUrl } : null));
                alert("Avatar updated successfully!");
            } catch (error) {
                console.error("Error updating avatar:", error);
                alert("Failed to update avatar.");
            }
        }
    };

    // 儲存編輯的資料
    const handleSaveChanges = async () => {
        if (editedUser) {
            try {
                const response = await fetch(`${baseUrl}/users/updateUserProfile`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        email: editedUser.email,
                        bio: editedUser.bio,
                        location: editedUser.location.value, // 傳遞 location 的 value
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to update user profile");
                }

                // 如果更新成功，將資料同步到本地狀態
                setUser(editedUser);
                setIsEditing(false);
                alert("Profile updated successfully!");
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile.");
            }
        }
    };

    // 取消編輯
    const handleCancelChanges = () => {
        setEditedUser(user);
        setIsEditing(false);
    };

    // 資料尚未加載完成時顯示 Loading
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            {/** 用戶頭像 */}
            <div className="relative">
                <label htmlFor="avatar-upload">
                <div className="flex justify-center items-center w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    <Image
                        src={user.avatarUrl}
                        alt="User Avatar"
                        width={128}
                        height={128}
                        className="object-cover"
                    />
                </div>
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateAvatar}
                    className="hidden"
                />
            </div>

            {/** 用戶資料 */}
            {!isEditing ? (
                <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-md p-4 space-y-4">
                    {/** 電子郵件 */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="text-gray-800">{user.email}</span>
                    </div>

                    {/** 位置 */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Location:</span>
                        <span className="text-gray-800">{user.location.label}</span>
                    </div>

                    {/** 總文章數 */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Posts:</span>
                        <span className="text-gray-800">{user.totalPosts}</span>
                    </div>

                    {/** 總按讚數 */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Likes:</span>
                        <span className="text-gray-800">{user.totalLikes}</span>
                    </div>

                    {/** 自我介紹 */}
                    <div>
                        <span className="text-gray-600 font-medium">Bio:</span>
                        <p className="text-gray-800">{user.bio}</p>
                    </div>

                    {/** 編輯按鈕 */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-md p-4 space-y-4">
                    {/** 編輯表單 */}
                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Email:</label>
                        <input
                            type="email"
                            value={editedUser?.email || ""}
                            onChange={(e) =>
                                setEditedUser((prev) =>
                                    prev ? { ...prev, email: e.target.value } : null
                                )
                            }
                            className="border rounded p-2 mt-1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Location:</label>
                        <Select
                            value={editedUser?.location || null}
                            onChange={(selectedOption: SingleValue<CountryOption>) =>
                                setEditedUser((prev) =>
                                    prev
                                        ? {
                                                ...prev,
                                                location:
                                                    selectedOption || {
                                                        value: "UNKNOWN",
                                                        label: "🌍 Unknown",
                                                    },
                                            }
                                        : null
                                )
                            }
                            options={countryOptions}
                            className="mt-1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-600 font-medium">Bio:</label>
                        <textarea
                            value={editedUser?.bio || ""}
                            onChange={(e) =>
                                setEditedUser((prev) =>
                                    prev ? { ...prev, bio: e.target.value } : null
                                )
                            }
                            className="border rounded p-2 mt-1"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handleCancelChanges}
                            className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
