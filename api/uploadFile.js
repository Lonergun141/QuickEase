import axios from 'axios';
import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const API2CONVERT_API_KEY = process.env.API2CONVERT_API_KEY;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ error: 'Missing jobId in query parameters' });
  }

  try {
    // Use Busboy to parse the incoming form data
    const busboy = new Busboy({ headers: req.headers });
    let fileData = null;
    let fileName = null;

    busboy.on('file', (fieldname, file, filename) => {
      fileName = filename;

      const chunks = [];

      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        fileData = Buffer.concat(chunks);
      });
    });

    busboy.on('finish', async () => {
      if (!fileData) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get the job details to retrieve the server URL
      const jobResponse = await axios.get(`https://api.api2convert.com/v2/jobs/${jobId}`, {
        headers: {
          'x-oc-api-key': API2CONVERT_API_KEY,
        },
      });

      const serverUrl = jobResponse.data.server;

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', fileData, fileName);

      // Upload the file to the API
      const uploadUrl = `${serverUrl}/upload-file/${jobId}`;
      const uploadResponse = await axios.post(uploadUrl, formData, {
        headers: {
          'x-oc-api-key': API2CONVERT_API_KEY,
          ...formData.getHeaders(),
        },
      });

      res.status(uploadResponse.status).json(uploadResponse.data);
    });

    busboy.on('error', (err) => {
      console.error('Error parsing form data:', err);
      res.status(500).json({ error: 'Error parsing form data' });
    });

    req.pipe(busboy);
  } catch (error) {
    console.error(`Error in /api/uploadFile:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
}
