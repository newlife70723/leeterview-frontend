import Link from "next/link";
import Image from "next/image";

interface AvatarProps {
  avatarUrl?: string;
  linkToProfile?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, linkToProfile = true }) => {
  const avatar = (
    <Image
      src={avatarUrl || "/customer.webp"}
      alt="User Avatar"
      width={96}
      height={96}
      className="rounded-full object-cover border border-gray-300"
    />
  );

  return linkToProfile ? (
    <Link href="/profile">{avatar}</Link> // 移除內部的 <a>
  ) : (
    avatar
  );
};

export default Avatar;
