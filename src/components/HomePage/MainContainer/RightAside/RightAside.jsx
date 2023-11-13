import { useState } from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import useInfinitScrolling from "../../../../hooks/useInfiniteScrolling";
import usePopulateTable from "../../../../hooks/usePopulateTable";
import "./RightAside.css";

import BitacoraTableRow from "../CustomTableRows/BitacoraTableRow/BitacoraTableRow";
import Error from "../Error/Error";
import Loading from "../Loading/Loading";

function RightAside() {
	const { user } = useAuthContext();

	const [pageNumber, setPageNumber] = useState(1);

	//Se encarga de las solicitudes http al servidor para completar la tabla
	//Takes care of the http requests to the server to pupulate the table
	const { loading, error, tableData, hasMore } = usePopulateTable("get", "/api/bitacora/get", pageNumber, user?._id);

	//se ocupa del último elemento representado en la lista, por lo que una vez que choca con la parte visible del navegador, envía una señal para enviar otra solicitud al servidor
	//Takes care of the las element rendered on the list so once it collides with the viewable part of the browser sends a signal to send another request to the server
	const lastElementRef = useInfinitScrolling(loading, hasMore, setPageNumber);

	return (
		<div className='RigthAsideContainer'>
			<input type='text' placeholder='<<Barra de Busqueda, Futura Implementación>>' />
			<h3>Bitacora</h3>
			<div className={`Bitacora ${tableData ? "Active" : ""}`}>
				<div className='ScrollDiv'>
					{tableData.map((object) => {
						if (tableData.length == tableData.lastIndexOf(object) + 1) {
							return (
								<div ref={lastElementRef} key={object.history_id}>
									<BitacoraTableRow data={object} />
								</div>
							);
						} else {
							return (
								<div key={object.history_id}>
									<BitacoraTableRow data={object} />
								</div>
							);
						}
					})}

					<div>{loading && <Loading />}</div>
					<div>{error && <Error />}</div>
				</div>
			</div>
		</div>
	);
}

export default RightAside;
