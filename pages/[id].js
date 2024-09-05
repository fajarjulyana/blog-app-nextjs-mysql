import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PostDetail({ post }) {
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleComment = async (e) => {
    e.preventDefault();
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id, content })
    });
    router.reload();
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <form onSubmit={handleComment}>
        <textarea
          placeholder="Leave a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Comment</button>
      </form>

      <h2>Comments</h2>
      <ul>
        {post.Comments && post.Comments.length > 0 ? (
          post.Comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))
        ) : (
          <li>No comments yet</li>
        )}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`http://localhost:3000/api/posts/${id}`);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const post = await res.json();
    return { props: { post } };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true,
    };
  }
}
