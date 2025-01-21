// pages/index.tsx
import Navbar from "../components/Navbar";

const navData = [
  {
    name: "Home",
    link: "/",
    subcategories: []
  },
  {
    name: "Categories",
    link: "/categories",
    subcategories: [
      { name: "Array", link: "/categories/array" },
      { name: "String", link: "/categories/string" },
      { name: "DP", link: "/categories/dp" }
    ]
  },
  {
    name: "Search",
    link: "/search",
    subcategories: []
  },
  {
    name: "Profile",
    link: "/profile",
    subcategories: []
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 標題區域 */}
      <div className="w-full text-white p-12">
        <h1 className="text-6xl font-extrabold text-left text-shadow-custom cursor-pointer">
          Leeterview
        </h1>
        <p className="text-xl font-semibold mt-4 text-white bg-clip-text bg-gradient-to-r from-black via-gray-600 to-gray-800 text-shadow-custom">
          Share your LeetCode solutions and earn points!
        </p>
      </div>

      {/* 主要內容區域 */}
      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* 左側導航欄 - 固定寬度，且高度隨內容調整 */}
        <div className="md:w-1/4 bg-transparent p-0 rounded-lg shadow-none">
          <Navbar items={navData} />
        </div>


        {/* 右側熱門文章區域 - 固定高度或最小高度 */}
        <section className="md:w-3/4 bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-4xl font-extrabold text-left text-gray-800 mb-6">Trending Posts</h2>
          {/* 文章內容 */}
        </section>
      </div>
    </div>
  );
};

export default Home;
