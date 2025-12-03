import type { PostType } from "@/types/post";

interface PostListProps {
  posts: PostType[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-gray-500">No posts yet.</p>;
  }

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.id} className="border-b pb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="mt-2 text-gray-700">{post.body}</p>
          <time className="mt-2 block text-sm text-gray-400">
            {new Date(post.created_at).toLocaleDateString()}
          </time>
        </li>
      ))}
    </ul>
  );
}
