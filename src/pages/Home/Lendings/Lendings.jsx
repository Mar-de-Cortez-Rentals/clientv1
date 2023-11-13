import './Lendings.css';
import { useParams } from 'react-router-dom';
import { useEffect, useContext, useState, useRef } from 'react';
import { SectionContext } from '../../../context/SectionContext';
import usePopulateTable from '../../../hooks/usePopulateTable.jsx';
import useInfinitScrolling from '../../../hooks/useInfiniteScrolling.jsx';
import useCountResults from '../../../hooks/useCountResults';

import { onlyNumbers } from '../../../helpers/regexes';

import { ModalAlert } from '../../../components/Modals/Alerts/Alerts';
import Error from '../../../components/HomePage/MainContainer/Error/Error';
import Loading from '../../../components/HomePage/MainContainer/Loading/Loading';
import LendingsTableRow from '../../../components/HomePage/MainContainer/CustomTableRows/LendingsTableRow/LendingsTableRow';
import SelectComponent from '../../../components/HomePage/MainContainer/Select/SelectComponent';
import CustomDateRangePicker from '../../../components/HomePage/MainContainer/CustomDatePicker/CustomDateRangePicker.jsx';
import SearchBar from '../../../components/HomePage/MainContainer/SearchBar/SearchBar';

function Lendings() {
	//Maneja el título de la barra de navegación superior
	//Handles the title for the upper navbar
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle('Prestamos');
		setPageNumber(1);
	}, []);

	const { id } = useParams();

	//Variables que utiliza el hook personalizado que se encarga de pupular la tableview
	//Varibles used by the personalized hook that is in charge of pupulating the tableview
	const [validInput, setvalidInput] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [isActive, setIsActive] = useState('false');
	const [queryOption, setQueryOption] = useState(
		id ? 'borrower_name' : 'lending_id'
	);
	const [query, setQuery] = useState(id);
	const [datesToFilter, setDatesToFilter] = useState([]);

	//Obtiene la cantidad de resultados posibles
	//Gets the amount of results posible
	const {
		loading: countLoading,
		error: countError,
		countData: countData,
	} = useCountResults(
		'/api/lendings/getCount',
		isActive,
		queryOption,
		query,
		datesToFilter
	);

	//Se encarga de las solicitudes http al servidor para completar la tabla
	//Takes care of the http requests to the server to pupulate the table
	const { loading, error, tableData, hasMore } = usePopulateTable(
		'get',
		'/api/lendings/get',
		pageNumber,
		isActive,
		queryOption,
		query,
		datesToFilter
	);

	//se ocupa del último elemento representado en la lista, por lo que una vez que choca con la parte visible del navegador, envía una señal para enviar otra solicitud al servidor
	//Takes care of the las element rendered on the list so once it collides with the viewable part of the browser sends a signal to send another request to the server
	const lastElementRef = useInfinitScrolling(loading, hasMore, setPageNumber);

	//Maneja las funciones de busqueda
	//Handles search when te user types into the input component
	const handleSearch = (e) => {
		const value = e.target.value;
		// Las siguientes declaraciones if manejan si el usuario escribe letras en lugar de números cuando intenta buscar por ID
		//The following if statements handles if the user types letters instead of numbers when tries to search by ID
		if (
			queryOption == 'lending_id' &&
			!onlyNumbers.test(value) &&
			value != ''
		) {
			e.target.textContent = value.match(/\d+/g);
			setvalidInput(false);
		} else {
			setvalidInput(true);
			setPageNumber(1);
			setQuery(value);
		}
	};

	//Maneja la opción de búsqueda (por ejemplo: buscar por ID, por nombre del prestatario, etc.)
	//Handles the search option (for example: search by ID, by BorrowerName, etc)
	const handleQueryOption = (field, value, e) => {
		if (value == 'lending_id' && !onlyNumbers.test(query) && query != '') {
			ModalAlert('error', 'La entrada no es válida', true);
			setQueryOption((prev) => {
				e.target.value = prev;
				return prev;
			});
		} else {
			setvalidInput(true);
			setPageNumber(1);
			setQueryOption(value);
			setQuery(inputSearchRef.current.value);
		}
	};

	//Maneja los rangos de fechas seccionados
	//Handles the range of dates selected
	const handleDateRanges = (e) => {
		setDatesToFilter(e);
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
		if (value == 'lending_id' && !onlyNumbers.test(value)) {
			e.target.value = value.match(/\d+/g);
		}
	};

	const inputSearchRef = useRef(null);

	//Arreglo de opciones que alimenta al componente de selección #SelectComponent
	//Array of options that feed the #SelectComponent
	const queryOptions = [
		{ value: 'lending_id', label: 'ID' },
		{ value: 'borrower_name', label: 'Prestatario' },
		{ value: 'user_name', label: 'Prestador' },
		{ value: 'lending_remarks', label: 'Notas' },
	];

	return (
		<div className='HomeChildContainer'>
			<div className='ChildMaster'>
				<div className='tableHeader Lendings'>
					<div className='TabOptions'>
						<h2
							className={isActive == 'false' ? 'active' : ''}
							onClick={() => handleTabActive('false')}
						>
							Activos
						</h2>
						<h2
							className={isActive == 'true' ? 'active' : ''}
							onClick={() => handleTabActive('true')}
						>
							Inactivos
						</h2>
					</div>
					<div className='SearchOptions'>
						<div>
							<p>
								{!countError && !countLoading && countData && validInput
									? `${countData} resultado(s)`
									: `					`}
							</p>
						</div>

						<div>
							<CustomDateRangePicker handleRange={handleDateRanges} />
							<SelectComponent
								options={queryOptions}
								handler={handleQueryOption}
								defaultSelected={queryOption}
							/>
							<SearchBar
								handler={handleSearch}
								validInput={validInput}
								idInput={handleValidId}
								refn={inputSearchRef}
								defaultValue={id || ''}
								visible={true}
							/>
						</div>
					</div>
				</div>

				<div className='TableScroll'>
					<div
						className={`tableContainer ShowTableAnim ${
							tableData.length > 0 ? 'Active' : ''
						}`}
					>
						{tableData
							/* .sort(
								(a, b) =>
									new Date(b.lending_borrowdate) -
									new Date(a.lending_borrowdate)
							) */
							.map((object) => {
								if (tableData.length === tableData.lastIndexOf(object) + 1) {
									return (
										<div key={object.lending_id} ref={lastElementRef}>
											<LendingsTableRow data={object} />
										</div>
									);
								} else {
									return (
										<LendingsTableRow key={object.lending_id} data={object} />
									);
								}
							})}

						<div>{loading && <Loading />}</div>
						<div>{error && <Error />}</div>
						<div>
							{!loading && !error && tableData.length < 1 && (
								<Error noResults={tableData.length < 1} />
							)}
						</div>
					</div>
				</div>
				<div style={{ height: '100px' }}></div>
			</div>
		</div>
	);
}

export default Lendings;
