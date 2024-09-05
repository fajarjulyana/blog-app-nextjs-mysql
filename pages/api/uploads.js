// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Upload failed' });
    }
    const oldPath = files.file.filepath;
    const newPath = `./public/uploads/${files.file.originalFilename}`;
    fs.rename(oldPath, newPath, (err) => {
      if (err) return res.status(500).json({ message: 'Save failed' });
      res.status(200).json({ location: `/uploads/${files.file.originalFilename}` });
    });
  });
}
