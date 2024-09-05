import Post from '../../models/Post';

export default async (req, res) => {
  if (req.method === 'GET') {
    // Read: Mendapatkan semua posting
    try {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts' });
    }
  } else if (req.method === 'POST') {
    // Create: Membuat posting baru
    const { title, content } = req.body;
    try {
      const newPost = await Post.create({ title, content });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post' });
    }
  } else if (req.method === 'PUT') {
    // Update: Mengedit posting berdasarkan ID
    const { id, title, content } = req.body;
    try {
      const post = await Post.findByPk(id);
      if (post) {
        post.title = title;
        post.content = content;
        await post.save();
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating post' });
    }
  } else if (req.method === 'DELETE') {
    // Delete: Menghapus posting berdasarkan ID
    const { id } = req.body;
    try {
      await Post.destroy({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
