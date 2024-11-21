import axios from 'axios';

const CONVERT_API_SECRET = import.meta.env.VITE_CONVERT_API;

export const convertFileToPng = async (file) => {
  let convertApiUrl;

  // Determine the correct ConvertAPI endpoint based on the file type
  switch (file.type) {
    case 'application/pdf':
      convertApiUrl = `https://v2.convertapi.com/convert/pdf/to/png`;
      break;
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-powerpoint':
      convertApiUrl = `https://v2.convertapi.com/convert/ppt/to/png`;
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      convertApiUrl = `https://v2.convertapi.com/convert/docx/to/png`;
      break;
    default:
      throw {
        code: 'UNSUPPORTED_FILE_TYPE',
        message: 'This file type is not supported. Please upload a PDF, DOC, DOCX, PPT, or PPTX file.'
      };
  }

  try {
    // Use FormData to handle file upload
    const formData = new FormData();
    formData.append('File', file);
    formData.append('PageRange', '1-40');
    formData.append('Timeout', '300'); // 5 minutes in seconds

    const response = await axios.post(convertApiUrl, formData, {
      headers: {
        'Authorization': `Bearer ${CONVERT_API_SECRET}`,
      },
      timeout: 300000, // 5 minutes in milliseconds
    });

    // Extract the files from the response
    const resultFiles = response.data.Files;

    if (!resultFiles) {
      throw {
        code: 'CONVERSION_FAILED',
        message: 'The file conversion failed. Please try again with a different file.'
      };
    }

    // Extract the base64 data from FileData and prepend the data URL prefix
    const pngFiles = resultFiles.map((file) => {
      if (!file.FileData) {
        throw {
          code: 'FILE_DATA_MISSING',
          message: 'The conversion was incomplete. Please try again.'
        };
      }
      const base64Data = `data:image/png;base64,${file.FileData}`;
      return base64Data;
    });

    return pngFiles;
  } catch (error) {
    console.error('Error during file conversion:', error);
    
    // Handle specific error cases
    if (error.code) {
      throw error; // Propagate custom error objects
    }
    if (error.response?.status === 413) {
      throw {
        code: 'FILE_TOO_LARGE',
        message: 'The file is too large to process. Maximum file size is 10MB.'
      };
    }
    if (error.code === 'ECONNABORTED') {
      throw {
        code: 'TIMEOUT',
        message: 'The conversion process timed out. Please try with a smaller file.'
      };
    }
    
    // Generic error
    throw {
      code: 'PROCESSING_ERROR',
      message: 'An error occurred while processing your file. Please try again.'
    };
  }
};
