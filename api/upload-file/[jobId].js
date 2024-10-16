import axios from 'axios';
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disables body parsing so that formidable can handle it
  },
};

export default async function handler(req, res) {
  const { jobId } = req.query;
  const API2CONVERT_API_KEY = process.env.API2CONVERT_API_KEY;

  try {
    // Parse the incoming form data
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const file = files.file;

      // Read the file data
      const fileData = fs.createReadStream(file.filepath);

      // Get the job details to retrieve the server URL
      const jobResponse = await axios.get(`https://api.api2convert.com/v2/jobs/${jobId}`, {
        headers: {
          'x-oc-api-key': API2CONVERT_API_KEY,
        },
      });

      const serverUrl = jobResponse.data.server;

      // Create FormData for the upload
      const formData = new FormData();
      formData.append('file', fileData, file.originalFilename);

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
  } catch (error) {
    console.error(`Error in /api/upload-file/${jobId}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
  }
}
