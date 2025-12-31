// themes/thirdshire/components/PostCard.js
export default function PostCard({ post }) {
  return (
    <article className="post-card p-5 bg-white">
      <a href={post.slug}>
        <h2 className="post-card-title">{post.title}</h2>
        {post.summary && (
          <p className="post-card-summary mt-2">{post.summary}</p>
        )}
      </a>
    </article>
  );
}
