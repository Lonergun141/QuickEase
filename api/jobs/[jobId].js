import axios from 'axios';

export default async function handler(req, res) {
  const { jobId } = req.query;
  const API2CONVERT_API_KEY = process.env.API2CONVERT_API_KEY;
  const apiUrl = `https://api.api2convert.com/v2/jobs/${jobId}`;

  try {
    const response = await axios({
      method: req.method,
      url: apiUrl,
      headers: {
        'x-oc-api-key': API2CONVERT_API_KEY,
        'Content-Type': 'application/json',
      },
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error in /api/jobs/${jobId}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
}
