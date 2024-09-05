import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Editor } from '@tinymce/tinymce-react';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      fetchPosts(); // Refresh the posts list
    }
  };

  const handleEdit = (post) => {
    setIsEditing(true);
    setEditPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/posts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editPostId, title, content }),
    });
    if (res.ok) {
      setIsEditing(false);
      setTitle('');
      setContent('');
      fetchPosts(); // Refresh the posts list
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/posts`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchPosts(); // Refresh the posts list
    }
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  return (
    <div>
      <h1>Manage Posts</h1>

      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Editor
          apiKey="ktjqtn97l51fscb4iu879v7cpgm7iw1mf7exrme3ecbs96ep" // Ganti dengan API key yang valid
          value={content}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'codesample advlist autolink lists link image charmap preview anchor textcolor searchreplace visualblocks code fullscreen insertdatetime media table paste codesample help wordcount',
            ],
            toolbar:
              'undo redo | bold italic underline | fontselect fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image | codesample | removeformat | help',
            images_upload_url: '/api/upload', // Endpoint untuk upload gambar
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = function () {
                  const file = this.files[0];
                  const reader = new FileReader();
                  reader.onload = function () {
                    callback(reader.result, {
                      alt: file.name,
                    });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }
            },
            codesample_languages: [
              { text: 'HTML/XML', value: 'markup' },
              { text: 'JavaScript', value: 'javascript' },
              { text: 'CSS', value: 'css' },
              { text: 'PHP', value: 'php' },
              { text: 'Python', value: 'python' },
            ],
            init_instance_callback: (editor) => {
              editor.on('SkinLoaded', () => console.log('Editor loaded successfully'));
              editor.on('Error', (e) => console.error('TinyMCE Error:', e));
            },
          }}
          onEditorChange={handleEditorChange}
        />
        <button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
