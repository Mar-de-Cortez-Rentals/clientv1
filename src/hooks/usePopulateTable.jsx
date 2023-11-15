import axios from "axios";
import { isArray } from "lodash";
import { useEffect, useState } from "react";
import { API_URL } from "../../config.js";
import { useAuthContext } from "./useAuthContext.jsx";

function usePopulateTable(endpoint, pageNumber, query) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const [queryChange, setQueryChange] = useState(false);
	const { user } = useAuthContext();

	/* const { user, dispatch } = useAuthContext(); */
	/* useEffect(() => {
		if (!user) {
			// Si no hay usuario, no se realiza la llamada a la endpoint
			return;
		}
	}, []); */

	/* Every time we change the searchTerm(also named variable 'query') the table is reseted to show the coincidences*/
	useEffect(() => {
		setTableData([]);
	}, [query]);

	/* The logic for querying the database dinamically */
	useEffect(() => {
		setLoading(true);
		setError(false);

		let cancel = () => {};

		let cleanup = false;

		const timeoutId = setTimeout(() => {
			axios({
				headers: {
					"x-access-token": user?.token,
				},
				method: `get`,
				url: `${API_URL}${endpoint}/${(pageNumber - 1) * 10}/${10}`,
				params: {
					...query,
				},
				cancelToken: new axios.CancelToken((c) => (cancel = c)),
			})
				.then((res) => {
					if (isArray(res.data)) {
						setTableData((prevTableData) => {
							return [...new Set([...prevTableData, ...res.data])];
						});
						setHasMore((prev) => res.data.length > 0);
						setLoading(false);
					} else {
						setTableData((prevTableData) => {
							return { data: [...new Set([...prevTableData, ...res.data.data])], totalCount: res.data.totalCount };
						});
						setHasMore((prev) => res.data.data.length > 0);
						setLoading(false);
					}
				})
				.catch((e) => {
					if (axios.isCancel(e)) return;
					setLoading(false);
					setError(true);
					if (e.response?.status == 404) {
						/* dispatch({ type: "LOGOUT" }); */
					}
					if (e?.response?.status == 418) {
						ModalAlert("error", "¡Sin laboratorio asigando!", false, 5000);
						return console.clear();
					}
				});
		}, 500);

		return () => {
			cleanup = true;
			clearTimeout(timeoutId);
			cancel();
		};
	}, [query, pageNumber, endpoint]);

	return { loading, error, tableData, hasMore, setTableData };
}

export default usePopulateTable;
