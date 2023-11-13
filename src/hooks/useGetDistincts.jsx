import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuthContext } from '../hooks/useAuthContext.jsx';

function useGetDistincts(api, index, name) {
	const [data, setData] = useState([]);
	const [error, setError] = useState(false);

	const { user } = useAuthContext();
	/* 
	useEffect(() => {
		if (!user) {
			// Si no hay usuario, no se realiza la llamada a la API
			return;
		}
	}, []); */

	useEffect(() => {
		let cancel;
		axios({
			headers: {
				'x-access-token': user.token,
			},
			method: `get`,
			url: `${API_URL}${api}`,
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				setData(res.data);
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				setError(true);
			});
	}, [api]);

	const distincts = useMemo(() => {
		if (!error) {
			return data.map((item) => {
				return { value: item[index], label: item[name] };
			});
		}
	}, [data]);

	return { distincts, error };
}

export default useGetDistincts;
