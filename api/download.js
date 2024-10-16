// api/download.js
import axios from 'axios';

export default async function handler(req, res) {
  const { uri } = req.query;

  try {
    const response = await axios.get(uri, {
      responseType: 'arraybuffer',
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error in /api/download:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
}
