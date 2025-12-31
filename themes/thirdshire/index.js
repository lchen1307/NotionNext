// themes/thirdshire/index.js
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PostCard from "./components/PostCard";
import Footer from "./components/Footer";

export default function ThirdshireLayout({ posts, global }) {
  return (
    <>
      <Navbar config={global.themeConfig} />

      {/* 顶部大 Hero 区块 */}
      <Hero config={global.themeConfig} />

      {/* 文章列表 */}
      <main className="container mx-auto px-6 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      <Footer />
    </>
  );
}
