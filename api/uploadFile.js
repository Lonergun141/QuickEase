import axios from 'axios';

export const config = {
	api: {
		bodyParser: false, 
	},
};

export default async function handler(req, res) {
	const { jobId } = req.query;
	const API2CONVERT_API_KEY = process.env.API2CONVERT_API_KEY;

	if (req.method === 'POST') {
		try {
			const uploadUrl = `https://api.api2convert.com/v2/jobs/${jobId}/upload-file`;
			const formData = req; 

			const response = await axios.post(uploadUrl, formData, {
				headers: {
					'x-oc-api-key': API2CONVERT_API_KEY,
					'Content-Type': req.headers['content-type'], 
				},
			});

			res.status(response.status).json(response.data);
		} catch (error) {
			console.error(
				`Error in /api/upload-file/${jobId}:`,
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json(
				error.response?.data || { error: 'Internal Server Error' }
			);
		}
	} else {
		res.status(405).json({ error: 'Method Not Allowed' });
	}
}
