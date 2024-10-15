import axios from 'axios';

const CONVERT_API_SECRET = import.meta.env.VITE_CONVERT_API;

export const convertFileToPng = async (file) => {
  let convertApiUrl;

  // Determine the correct ConvertAPI endpoint based on the file type
  switch (file.type) {
    case 'application/pdf':
      convertApiUrl = `https://v2.convertapi.com/convert/pdf/to/png?Secret=${CONVERT_API_SECRET}`;
      break;
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-powerpoint':
      convertApiUrl = `https://v2.convertapi.com/convert/ppt/to/png?Secret=${CONVERT_API_SECRET}`;
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      convertApiUrl = `https://v2.convertapi.com/convert/doc/to/png?Secret=${CONVERT_API_SECRET}`;
      break;
    default:
      throw new Error('Unsupported file type');
  }

  // Use FormData to handle file upload in a multipart form
  const formData = new FormData();
  formData.append('File', file); // Note the uppercase 'F'

  try {
    // Send the request to ConvertAPI
    const response = await axios.post(convertApiUrl, formData);

    // Log the response data
    console.log('ConvertAPI Response:', response.data);

    // Extract the files from the response
    const resultFiles = response.data.Files;

    if (!resultFiles) {
      throw new Error('Conversion failed. No files returned from ConvertAPI.');
    }

    // Extract the base64 data from FileData and prepend the data URL prefix
    const pngFiles = resultFiles.map((file) => {
      if (!file.FileData) {
        throw new Error(`FileData is missing in the response for file: ${file.FileName}`);
      }
      const base64Data = `data:image/png;base64,${file.FileData}`;
      return base64Data;
    });

    return pngFiles;
  } catch (error) {
    console.error('Error during file conversion:', error);
    throw error;
  }
};
