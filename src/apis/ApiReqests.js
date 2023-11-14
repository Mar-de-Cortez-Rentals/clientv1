import axios from "axios";
import { API_URL } from "../../config.js";
import { ModalAlert } from "../components/Modals/Alerts/Alerts.jsx";
import { httpErrors } from "../utils/httpErrors.js";

export const UpdateReq = async (api, data, token) => {
	return await axios({
		headers: {
			"x-access-token": token,
		},
		method: "put",
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
			"x-access-token": token,
		},
		method: "post",
		url: `${API_URL}${api}`,
		data: data,
	})
		.then((res) => {
			console.log(res);
			const { message, icon } = httpErrors[res.status];
			ModalAlert(icon, message, true);
			return res.data;
		})
		.catch((err) => {
			const { message, icon } = httpErrors[err.code];
			ModalAlert(icon, message, true);
			//return err;
		});
};

export const DeleteReq = async (api, query, token) => {
	return await axios({
		headers: {
			"x-access-token": token,
		},
		method: "delete",
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
			"x-access-token": token,
		},
		method: "get",
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
