"use client";

import Avatar from "../../components/Avatar";

const ProfilePage = () => {
  // 假設的用戶數據，未來可以從 API 或後端獲取
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {/* 用戶頭像 */}
      <Avatar avatarUrl={user.avatarUrl} linkToProfile={false} />

      {/* 用戶名稱 */}
      <h1 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h1>

      {/* 用戶電子郵件 */}
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};

export default ProfilePage;
