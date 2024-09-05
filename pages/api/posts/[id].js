import { Post, Comment } from '../../../models';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await Post.findOne({
        where: { id },
        include: [{ model: Comment, as: 'Comments' }]
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
