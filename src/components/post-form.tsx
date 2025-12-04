import { FormEvent, useState } from 'react';
import { PostFormType } from '@/types/post';

export default function PostForm({
  onPostCreated 
}: PostFormType
) {
  const [post, setPost] = useState({
    title: '',
    body: '',
    isSubmitting: false
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPost({ ...post, isSubmitting: true });

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: post.title,
          body: post.body
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }
      
      onPostCreated();
      setPost({ title: '', body: '', isSubmitting: false });
    } catch (error) {
      console.error(error);
      setPost({ ...post, isSubmitting: false });
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium">
          Body
        </label>
        <textarea
          id="body"
          value={post.body}
          onChange={(e) => setPost({ ...post, body: e.target.value })}
          required
          rows={4}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={post.isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {post.isSubmitting ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}
