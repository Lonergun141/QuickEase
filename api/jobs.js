import axios from 'axios';

export default async function handler(req, res) {
  const API2CONVERT_API_KEY = process.env.API2CONVERT_API_KEY;
  const apiUrl = 'https://api.api2convert.com/v2/jobs';

  if (req.method === 'POST') {
    try {
      const response = await axios.post(apiUrl, req.body, {
        headers: {
          'x-oc-api-key': API2CONVERT_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error in /api/jobs:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
