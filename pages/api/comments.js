import { Comment } from '../../models';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { postId, content } = req.body;
    const comment = await Comment.create({ postId, content });
    res.status(201).json(comment);
  }
}
