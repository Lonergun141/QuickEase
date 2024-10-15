import ConvertApi from 'convertapi-js';
import axios from 'axios';

const CONVERT_API_SECRET = import.meta.env.VITE_Convert_API;
const convertApi = ConvertApi.auth(CONVERT_API_SECRET);

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const convertFileToPng = async (file) => {
  const params = convertApi.createParams();
  params.add('file', file);

  let result;
  switch (file.type) {
    case 'application/pdf':
      result = await convertApi.convert('pdf', 'png', params);
      break;
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    case 'application/vnd.ms-powerpoint':
      result = await convertApi.convert('ppt', 'png', params);
      break;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      result = await convertApi.convert('doc', 'png', params);
      break;
    default:
      throw new Error('Unsupported file type');
  }

  const pngFiles = await Promise.all(result.files.map(async (file) => {
    const response = await axios.get(file.Url, { responseType: 'blob' });
    const base64 = await blobToBase64(response.data);
    return base64;
  }));

  return pngFiles;
};