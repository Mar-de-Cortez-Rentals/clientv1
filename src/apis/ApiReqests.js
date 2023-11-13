import axios from 'axios';
import { API_URL } from '../../config.js';

export const UpdateReq = async (api, data, token) => {
	return await axios({
		headers: {
			'x-access-token': token,
		},
		method: 'put',
		url: `${API_URL}${api}`,
		data: data,
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			return err;
		});
};

export const CreateReq = async (api, data, token) => {
	return axios({
		headers: {
			'x-access-token': token,
		},
		method: 'post',
		url: `${API_URL}${api}`,
		data: data,
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			return err;
		});
};

export const DeleteReq = async (api, query, token) => {
	return await axios({
		headers: {
			'x-access-token': token,
		},
		method: 'delete',
		url: `${API_URL}${api}`,
		params: query,
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			return err;
		});
};

export const GetReq = async (api, query, token) => {
	return await axios({
		headers: {
			'x-access-token': token,
		},
		method: 'get',
		url: `${API_URL}${api}`,
		params: query,
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			return err;
		});
};
