import Link from "next/link";

interface AvatarProps {
  avatarUrl?: string; // 頭像的 URL，如果沒有，顯示預設頭像
  linkToProfile?: boolean; // 是否讓頭像可以點擊並跳轉到 /profile
}

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, linkToProfile = true }) => {
  const avatar = (
    <img
      src={avatarUrl || "https://i.pravatar.cc/150?img=1"} // 預設頭像
      alt="User Avatar"
      className="w-24 h-24 rounded-full object-cover border border-gray-300"
    />
  );

  return linkToProfile ? (
    <Link href="/profile">
      <a className="cursor-pointer">{avatar}</a>
    </Link>
  ) : (
    avatar
  );
};

export default Avatar;
