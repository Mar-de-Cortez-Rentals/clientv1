import './UsersManagement.css';
import { useEffect, useContext, useState, useRef } from 'react';
import { SectionContext } from '../../../context/SectionContext';
import usePopulateTable from '../../../hooks/usePopulateTable';
import useInfinitScrolling from '../../../hooks/useInfiniteScrolling';
import useGetDistincts from '../../../hooks/useGetDistincts';

import { ModalAlert } from '../../../components/Modals/Alerts/Alerts';
import SearchBar from '../../../components/HomePage/MainContainer/SearchBar/SearchBar';
import SelectComponent from '../../../components/HomePage/MainContainer/Select/SelectComponent';
import Error from '../../../components/HomePage/MainContainer/Error/Error';
import Loading from '../../../components/HomePage/MainContainer/Loading/Loading';
import UserComponent from '../../../components/HomePage/MainContainer/CustomTableRows/UserComponent/UserComponent';

import { onlyNumbers } from '../../../helpers/regexes';

function UsersManagement() {
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle('Manejo de usuarios');
		setPageNumber(1);
	}, []);

	//Variables que utiliza el hook personalizado que se encarga de pupular la tableview
	//Varibles used by the personalized hook that is in charge of pupulating the tableview
	const [pageNumber, setPageNumber] = useState(1);
	const [conditional, setConditional] = useState('active');
	const [queryOption, setQueryOption] = useState('user_id');
	const [query, setQuery] = useState('');
	const [validInput, setvalidInput] = useState(true);

	//Se encarga de las solicitudes http al servidor para completar la tabla
	//Takes care of the http requests to the server to pupulate the table
	const { loading, error, tableData, hasMore } = usePopulateTable(
		'get',
		'/api/users/get',
		pageNumber,
		conditional,
		queryOption,
		query
	);

	//se ocupa del último elemento representado en la lista, por lo que una vez que choca con la parte visible del navegador, envía una señal para enviar otra solicitud al servidor
	//Takes care of the las element rendered on the list so once it collides with the viewable part of the browser sends a signal to send another request to the server
	const lastElementRef = useInfinitScrolling(loading, hasMore, setPageNumber);

	//Maneja la consulta a la base de datos basada en el tipo de usuario
	//Handles the query to the database based on the user_type
	const handleUserType = (e) => {
		setConditional(e.target.value);

		setPageNumber(1);
	};

	//Maneja las funciones de busqueda
	//Handles search when te user types into the input component
	const handleSearch = (e) => {
		const value = e.target.value;

		if (queryOption == 'user_id' && !onlyNumbers.test(value) && value != '') {
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
		if (value == 'user_id' && !onlyNumbers.test(query) && query != '') {
			ModalAlert('error', 'La entrada no es válida', true);
			setQueryOption((prev) => {
				e.target.value = prev;
				return prev;
			});
		} else {
			setvalidInput(true);
			setPageNumber(1);
			setQueryOption(value);
			setQuery();
		}
	};

	const inputSearchRef = useRef(null);

	const { distincts: labNameDistincts } = useGetDistincts(
		'/api/labs/get',
		'lab_id',
		'lab_name'
	);

	const { distincts: userTypeDistincts } = useGetDistincts(
		'/api/users/getUserTypes',
		'user_type',
		'user_type'
	);

	const queryOptions = [
		{ value: 'user_id', label: 'ID' },
		{ value: 'user_fullname', label: 'Nombre' },
		{ value: 'user_email', label: 'Correo' },
		{ value: 'user_type', label: 'Tipo de usuario' },
		{ value: 'user_jobposition', label: 'Puesto' },
	];

	const tabOptions = [
		{ value: 'activo', label: 'Activos' },
		{ value: 'inactivo', label: 'Inactivos' },
		{ value: '', label: 'Todos' },
	];

	return (
		<div className='HomeChildContainer UsersManagement'>
			<div className='Personas tableHeader'>
				<h2>Usuarios del sistema</h2>
				<div className='UserTabOptions Personas SearchOptions'>
					<div className='UserTabOptions RollContainer'>
						<div className='RollItemsContainer'>
							{tabOptions.map((object, index) => {
								return (
									<button
										key={index}
										className='TabOption Card'
										onClick={handleUserType}
										value={object.value}
									>
										{object.label}
									</button>
								);
							})}
						</div>
					</div>
					<div className='SearchOptionsRigtside'>
						<SelectComponent
							options={queryOptions}
							handler={handleQueryOption}
						/>

						<SearchBar
							visible={queryOption != 'borrower_career'}
							handler={handleSearch}
							validInput={validInput}
							refn={inputSearchRef}
						/>
					</div>
				</div>
			</div>

			<div
				className={`Users tableContainer ShowTableAnim ${
					tableData.length > 0 ? 'Active' : ''
				}`}
			>
				{tableData.map((user) => {
					if (tableData.length === tableData.lastIndexOf(user) + 1) {
						return (
							<div key={user.user_id} ref={lastElementRef} className='RefDiv'>
								<UserComponent
									key={user.user_id}
									data={user}
									labNameDistincts={labNameDistincts}
									userTypeDistincts={userTypeDistincts}
								/>
							</div>
						);
					} else {
						return (
							<UserComponent
								key={user.user_id}
								data={user}
								labNameDistincts={labNameDistincts}
								userTypeDistincts={userTypeDistincts}
							/>
						);
					}
				})}
			</div>

			<div>{loading && <Loading />}</div>
			<div>{error && <Error />}</div>
			<div>
				{!loading && !error && tableData.length < 1 && (
					<Error noResults={tableData.length < 1} />
				)}
			</div>
		</div>
	);
}

export default UsersManagement;
