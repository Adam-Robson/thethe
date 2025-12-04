"use client";

import { useEffect, useState } from "react";
import { PostList } from "@/components/post-list";
import PostForm from "@/components/post-form";
import type { PostType } from "@/types/post";

export default function PostsPage() {
  const [posts, setPosts] = useState<PostType[]>([]);

  async function fetchPosts() {
    const response = await fetch("/api/posts");
    const data = await response.json();
    console.info("Fetched posts:", data);
    setPosts(data.posts);
  }

  useEffect(() => {
    async function fetchData() {
      await fetchPosts();
    }
    fetchData();
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Journal</h1>
      <PostForm onPostCreated={fetchPosts} />
      <hr className="my-8" />
      <PostList posts={posts} />
    </main>
  );
}
