import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    router.push('/admin/posts');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Editor
        apiKey="ktjqtn97l51fscb4iu879v7cpgm7iw1mf7exrme3ecbs96ep"
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 400,
          menubar: false
        }}
      />
      <button type="submit">Create Post</button>
    </form>
  );
}
