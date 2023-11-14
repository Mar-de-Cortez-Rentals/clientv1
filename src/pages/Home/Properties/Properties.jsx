import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SectionContext } from "../../../context/SectionContext.jsx";
import { useAuthContext } from "../../../hooks/useAuthContext.jsx";
import useInfinitScrolling from "../../../hooks/useInfiniteScrolling.jsx";
import usePopulateTable from "../../../hooks/usePopulateTable.jsx";
import "./Properties.css";

import { CreateReq } from "../../../apis/ApiReqests.js";

import OnCreateButton from "../../../components/HomePage/MainContainer/Buttons/OnCreateButton/OnCreateButton.jsx";
import InventoryTableRow from "../../../components/HomePage/MainContainer/CustomTableRows/InventoryTableRow/InventoryTableRow.jsx";
import Error from "../../../components/HomePage/MainContainer/Error/Error.jsx";
import Loading from "../../../components/HomePage/MainContainer/Loading/Loading.jsx";
import SearchBar from "../../../components/HomePage/MainContainer/SearchBar/SearchBar.jsx";
import SelectComponent from "../../../components/HomePage/MainContainer/Select/SelectComponent.jsx";
import { ItemFields, ItemForm } from "../../../components/Modals/FormDialogs/HtmlForms/PropertyHtml.js";
import { ItemFormDialog } from "../../../components/Modals/FormDialogs/ItemFormDialog.jsx";

function Properties() {
	//Maneja el título de la barra de navegación superior
	//Handles the title for the upper navbar
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle("Propiedades");
		setPageNumber(1);
	}, []);

	//Variables que utiliza el hook personalizado que se encarga de pupular la tableview
	//Varibles used by the personalized hook that is in charge of pupulating the tableview
	const [pageNumber, setPageNumber] = useState(1);
	const [isAvailable, setIsAvailable] = useState("");
	const [queryOption, setQueryOption] = useState("item_type");
	const [query, setQuery] = useState("");
	const [selectedItems, setSelectedItems] = useState([]);
	const [showSelected, setShowSelected] = useState(false);
	const [hideComponente, setHideComponente] = useState(false);

	const { user } = useAuthContext();

	//Se encarga de las solicitudes http al servidor para completar la tabla
	//Takes care of the http requests to the server to pupulate the table
	const { loading, error, tableData, hasMore } = usePopulateTable("get", "/property", pageNumber, isAvailable, queryOption, query);

	//se ocupa del último elemento representado en la lista, por lo que una vez que choca con la parte visible del navegador, envía una señal para enviar otra solicitud al servidor
	//Takes care of the las element rendered on the list so once it collides with the viewable part of the browser sends a signal to send another request to the server
	const lastElementRef = useInfinitScrolling(loading, hasMore, setPageNumber);

	//Maneja las funciones de busqueda
	//Handles search when te user types into the input component
	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};

	//Maneja la opción de búsqueda (por ejemplo: buscar por ID, por nombre del prestatario, etc.)
	//Handles the search option (for example: search by ID, by BorrowerName, etc)
	const handleQueryOption = (field, value) => {
		setQueryOption(value);
		setPageNumber(1);
	};

	//Maneja los materiales disponibles y no disponibles, para que el usuario pueda elegir qué lista quiere ver
	//Handles the available and non-available items, so the user can choose which list wants to see
	const handleAvailability = (field, value) => {
		setIsAvailable(value);
		setPageNumber(1);
	};

	//Maneja la creación de un nuevo material
	//Handles the creation of a new item
	const handleCreate = async () => {
		const element = await ItemFormDialog("Nueva Propiedad", ItemForm, ItemFields);
		const resData = await CreateReq("/property", element, user.token);
		if (resData) {
			setPageNumber(1);
		}
	};

	//Maneja la selección de los materiales
	//Handles the selection of the items
	const handleSelectedItem = (e, value) => {
		if (e.target.checked) {
			setSelectedItems((prev) => [...prev, value]);
		} else {
			setSelectedItems((prev) => {
				if (prev.length === 1) {
					setShowSelected(false);
				}
				return prev.filter((item) => item !== value);
			});
		}
	};

	//Arreglos de opciones que alimenta al componente de selección #SelectComponent
	//Arrays of options that feed the #SelectComponent
	const queryOptions = [
		{ value: "name", label: "Nombre" },
		{ value: "address", label: "Dirección" },
		{ value: "type", label: "Tipo" },
	];

	const availabityOptions = [
		{ value: "", label: "Todos" },
		{ value: "true", label: "Disponibles" },
		{ value: "false", label: "No Disponibles" },
	];

	return (
		!hideComponente && (
			<div className='HomeChildContainer'>
				<div className='ChildMaster'>
					<div className='tableHeader SearchOptions'>
						<h2>Propiedades</h2>
						<div className='SearchSelects'>
							{selectedItems.length > 0 && (
								<button
									className={`RoundedRect LookSelected ${showSelected ? "Active" : ""}`}
									onClick={() => {
										setShowSelected(!showSelected);
									}}>
									Ver seleccionados
								</button>
							)}
							<p>Buscar por</p>
							<SelectComponent options={availabityOptions} handler={handleAvailability} />
							<SelectComponent options={queryOptions} handler={handleQueryOption} />
							<SearchBar handler={handleSearch} validInput={true} visible={true} />
						</div>
					</div>

					<div className='TableScroll'>
						<div className={`tableContainer ShowTableAnim ${tableData?.length > 0 ? "Active" : ""}`}>
							{!showSelected &&
								tableData.map((object) => {
									if (tableData?.length === tableData.lastIndexOf(object) + 1) {
										return (
											<div key={object._id} ref={lastElementRef}>
												<InventoryTableRow data={object} handleSelected={handleSelectedItem} selectedItems={selectedItems} />
											</div>
										);
									} else {
										return <InventoryTableRow key={object._id} data={object} handleSelected={handleSelectedItem} selectedItems={selectedItems} />;
									}
								})}

							{showSelected &&
								tableData
									.filter((object) => selectedItems.includes(object._id))
									.map((object) => (
										<InventoryTableRow key={object._id} data={object} handleSelected={handleSelectedItem} selectedItems={selectedItems} />
									))}

							<div>{loading && <Loading />}</div>
							<div>{error && <Error />}</div>
							<div>{!loading && !error && tableData.length < 1 && <Error noResults={tableData.length < 1} />}</div>
						</div>
					</div>
					<div style={{ height: "100px" }}></div>
				</div>
				{selectedItems.length > 0 && (
					<button className='OnCreateButton LendButton' /* onClick={handleLendItems} */>
						<Link to={`../personas/${selectedItems}`}>Prestar Materiales</Link>
					</button>
				)}
				{!error && user.userType == "admin" && <OnCreateButton handler={handleCreate} />}
			</div>
		)
	);
}

export default Properties;
