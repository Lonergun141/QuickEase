// src/Converter/convertAPI.js
import axios from 'axios';

export const convertFilesToPng = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided for conversion');
  }

  try {
    // Step 1: Create a new job without any input files
    const jobResponse = await axios.post('/api/jobs', {
      conversion: [
        {
          target: 'png',
          options: {
            allow_multiple_outputs: true,
          },
        },
      ],
      process: false,
    });

    const { id: jobId } = jobResponse.data;

    // Step 2: Upload all files to the job via your serverless function
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      try {
        await axios.post(`/api/upload-file/${jobId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (uploadError) {
        console.error(`Error uploading file ${file.name}:`, uploadError);
        throw new Error(`Failed to upload file ${file.name}: ${uploadError.message}`);
      }
    }

    // Step 3: Start processing the job
    await axios.patch(`/api/jobs/${jobId}`, { process: true });

    // Step 4: Poll for job completion
    let result;
    let attempts = 0;
    const maxAttempts = 30; // Adjust as needed
    while (!result || (result.status.code !== 'completed' && result.status.code !== 'failed')) {
      if (attempts >= maxAttempts) {
        throw new Error('Job processing timed out');
      }

      const jobStatus = await axios.get(`/api/jobs/${jobId}`);
      result = jobStatus.data;

      if (result.status.code === 'failed') {
        throw new Error('Conversion failed: ' + JSON.stringify(result.errors));
      }

      // Wait for 2 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    // Step 5: Fetch all converted PNG files
    const pngFiles = await Promise.all(
      result.output.map(async (output) => {
        try {
          const response = await axios.get(`/api/download`, {
            params: { uri: output.uri },
            responseType: 'blob',
          });
          return blobToBase64(response.data);
        } catch (downloadError) {
          console.error(`Error downloading converted file:`, downloadError);
          throw new Error(`Failed to download converted file: ${downloadError.message}`);
        }
      })
    );

    return pngFiles; // Return an array of base64 strings
  } catch (error) {
    console.error('Error during file conversion:', error);
    throw new Error('File conversion failed: ' + error.message);
  }
};

// Helper function to convert blob to base64 (unchanged)
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
