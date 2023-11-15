import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SectionContext } from "../../../context/SectionContext.jsx";
import useInfinitScrolling from "../../../hooks/useInfiniteScrolling.jsx";
import usePopulateTable from "../../../hooks/usePopulateTable.jsx";
import "./Leases.scss";

import { onlyNumbers } from "../../../helpers/regexes.js";

import CustomDateRangePicker from "../../../components/HomePage/MainContainer/CustomDatePicker/CustomDateRangePicker.jsx";
import LendingsTableRow from "../../../components/HomePage/MainContainer/CustomTableRows/LendingsTableRow/LendingsTableRow.jsx";
import Error from "../../../components/HomePage/MainContainer/Error/Error.jsx";
import Loading from "../../../components/HomePage/MainContainer/Loading/Loading.jsx";
import SearchBar from "../../../components/HomePage/MainContainer/SearchBar/SearchBar.jsx";
import SelectComponent from "../../../components/HomePage/MainContainer/Select/SelectComponent.jsx";

function Leases() {
	//Maneja el título de la barra de navegación superior
	//Handles the title for the upper navbar
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle("Prestamos");
		setPageNumber(1);
	}, []);

	const { id } = useParams();

	//Variables que utiliza el hook personalizado que se encarga de pupular la tableview
	//Varibles used by the personalized hook that is in charge of pupulating the tableview
	const [isActive, setIsActive] = useState(false);
	const [validInput, setvalidInput] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [query, setQuery] = useState({});

	//Se encarga de las solicitudes http al servidor para completar la tabla
	//Takes care of the http requests to the server to pupulate the table
	const { loading, error, tableData, hasMore } = usePopulateTable("/lease", pageNumber, query);

	//se ocupa del último elemento representado en la lista, por lo que una vez que choca con la parte visible del navegador, envía una señal para enviar otra solicitud al servidor
	//Takes care of the las element rendered on the list so once it collides with the viewable part of the browser sends a signal to send another request to the server
	const lastElementRef = useInfinitScrolling(loading, hasMore, setPageNumber);

	//Maneja las funciones de busqueda
	//Handles search when te user types into the input component
	const handleQuery = (field, value) => {
		console.log(field, value);
		setQuery((prev) => ({ [field]: value, ["lease_start_date"]: prev["lease_start_date"] }));
		setPageNumber(1);
	};

	//Maneja los préstamos activos e inactivos, para que el usuario pueda elegir qué lista quiere ver
	//Handles the active and inactive lendings, so the user can choose which list wants to see
	const handleTabActive = (value) => {
		setIsActive(value);
		setPageNumber(1);
	};

	//Maneja la función de validación de ID
	//Handles the ID validation function
	const handleValidId = (e) => {
		const value = e.target.value;
		if (value == "lending_id" && !onlyNumbers.test(value)) {
			e.target.value = value.match(/\d+/g);
		}
	};

	useEffect(() => {
		console.log(query);
	}, [query]);

	const inputSearchRef = useRef(null);

	//Arreglo de opciones que alimenta al componente de selección #SelectComponent
	//Array of options that feed the #SelectComponent
	const queryOptions = [
		{ value: "property_name", label: "Nombre/Propiedad" },
		{ value: "tenant_name", label: "Arrendatario" },
		{ value: "lease_start_date", label: "fecha de inicio" },
	];

	return (
		<div className='HomeChildContainer'>
			<div className='ChildMaster'>
				<div className='tableHeader Lendings'>
					<div className='TabOptions'>
						<h2 className={!isActive ? "active" : ""} onClick={() => handleTabActive(false)}>
							Activos
						</h2>
						<h2 className={isActive ? "active" : ""} onClick={() => handleTabActive(true)}>
							Inactivos
						</h2>
					</div>
					<div className='SearchOptions'>
						<div>
							<p>{!error && !loading && tableData.totalCount && validInput ? `${tableData.totalCount} resultado(s)` : `					`}</p>
						</div>

						<div>
							<CustomDateRangePicker
								handleRange={(e) => {
									handleQuery("lease_start_date", e);
								}}
							/>
							<SelectComponent options={queryOptions} handler={handleQuery} />
							<SearchBar
								handler={(e) => handleQuery(Object.keys(query)[0], e.target.value)}
								validInput={validInput}
								visible={true}
								value={query[Object.keys(query)[0]]}
							/>
						</div>
					</div>
				</div>

				<div className='TableScroll'>
					<div className={`tableContainer ShowTableAnim ${tableData.length > 0 ? "Active" : ""}`}>
						{tableData?.data
							/* .sort(
								(a, b) =>
									new Date(b.lending_borrowdate) -
									new Date(a.lending_borrowdate)
							) */
							?.map((object) => {
								if (tableData?.data?.length === tableData?.data?.lastIndexOf(object) + 1) {
									return (
										<div key={object.lending_id} ref={lastElementRef}>
											<LendingsTableRow data={object} />
										</div>
									);
								} else {
									return <LendingsTableRow key={object.lending_id} data={object} />;
								}
							})}

						<div>{loading && <Loading />}</div>
						<div>{error && <Error />}</div>
						<div>{!loading && !error && tableData?.data?.length < 1 && <Error noResults={tableData?.data?.length < 1} />}</div>
					</div>
				</div>
				<div style={{ height: "100px" }}></div>
			</div>
		</div>
	);
}

export default Leases;
