import Link from "next/link";
import Image from "next/image";

interface AvatarProps {
  avatarUrl?: string;
  linkToProfile?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, linkToProfile = true }) => {
  const avatar = (
    <Image
      src={avatarUrl || "/images/customer.webp"}
      alt="User Avatar"
      width={96}
      height={96} 
      className="rounded-full object-cover border border-gray-300"
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
