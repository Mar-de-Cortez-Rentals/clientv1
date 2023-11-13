import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config.js';
import { useAuthContext } from '../hooks/useAuthContext.jsx';

function useCountResults(api, conditional, queryOption, query, dateFilter) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [countData, setCountData] = useState();

	const { user } = useAuthContext();
	/* useEffect(() => {
		if (!user) {
			// Si no hay usuario, no se realiza la llamada a la API
			return;
		}
	}, []); */

	/* Every time we change the searchTerm(also named variable 'query') the table is reseted to show the coincidences*/
	useEffect(() => {
		setCountData(0);
	}, [query, conditional, queryOption, dateFilter]);

	/* The logic for querying the database dinamically */
	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		axios({
			headers: {
				'x-access-token': user.token,
			},
			method: `get`,
			url: `${API_URL}${api}`,
			params: {
				conditional: conditional,
				queryOption: queryOption,
				searchTerm: query,
				dateFilter: dateFilter,
			},
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				setLoading(false);
				return setCountData(res.data);
			})
			.catch((e) => {
				if (axios.isCancel(e)) return;
				setLoading(false);
				setError(true);
			});
		return () => cancel();
	}, [api, query, queryOption, conditional, dateFilter]);

	return { loading, error, countData };
}

export default useCountResults;
