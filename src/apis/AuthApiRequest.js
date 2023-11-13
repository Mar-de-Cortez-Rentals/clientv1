import axios from 'axios';
import { API_URL } from '../../config.js';

export const AuthRequest = async (api, data) => {
	return await axios({
		method: 'post',
		url: `${API_URL}${api}`,
		data: data,
	})
		.then((res) => {
			return res;
		})
		.catch((err) => {
			return err;
		});
};
