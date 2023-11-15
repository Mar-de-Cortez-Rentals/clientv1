import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SectionContext } from "../../../context/SectionContext.jsx";
import { useAuthContext } from "../../../hooks/useAuthContext.jsx";
import useInfinitScrolling from "../../../hooks/useInfiniteScrolling.jsx";
import usePopulateTable from "../../../hooks/usePopulateTable.jsx";
import "./Tenants.scss";

import { CreateReq } from "../../../apis/ApiReqests.js";
import { onlyNumbers } from "../../../helpers/regexes.js";

import OnCreateButton from "../../../components/HomePage/MainContainer/Buttons/OnCreateButton/OnCreateButton.jsx";
import PersonasTableRow from "../../../components/HomePage/MainContainer/CustomTableRows/PersonasTableRow/PersonasTableRow.jsx";
import Error from "../../../components/HomePage/MainContainer/Error/Error.jsx";
import Loading from "../../../components/HomePage/MainContainer/Loading/Loading.jsx";
import SearchBar from "../../../components/HomePage/MainContainer/SearchBar/SearchBar.jsx";
import SelectComponent from "../../../components/HomePage/MainContainer/Select/SelectComponent.jsx";
import { ModalAlert } from "../../../components/Modals/Alerts/Alerts.jsx";
import { ConfirmModal } from "../../../components/Modals/ConfirmModal/ConfirmModal.jsx";
import { ContactFields, PersonaFields, PersonaFullForm } from "../../../components/Modals/FormDialogs/HtmlForms/PersonaHtml.js";
import { PersonaFormDialog } from "../../../components/Modals/FormDialogs/PersonaFormDialog.jsx";

import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Tenants() {
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle("Arrendatarios");
		setPageNumber(1);
	}, []);

	const { items } = useParams();
	const navigate = useNavigate();

	//Variables que utiliza el hook personalizado que se encarga de pupular la tableview
	//Varibles used by the personalized hook that is in charge of pupulating the tableview
	const [keepExpand, setKeepExpand] = useState(false);
	const [validInput, setvalidInput] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [userTypeQuery, setUserTypeQuery] = useState([]);
	const [queryOption, setQueryOption] = useState("borrower_id");
	const [query, setQuery] = useState("");

	const { user } = useAuthContext();

	//Se encarga de las solicitudes http al servidor para completar la tabla
	//Takes care of the http requests to the server to pupulate the table
	const { loading, error, tableData, hasMore } = usePopulateTable("/tenant", pageNumber, query);

	//se ocupa del último elemento representado en la lista, por lo que una vez que choca con la parte visible del navegador, envía una señal para enviar otra solicitud al servidor
	//Takes care of the las element rendered on the list so once it collides with the viewable part of the browser sends a signal to send another request to the server
	const lastElementRef = useInfinitScrolling(loading, hasMore, setPageNumber);

	//Maneja las funciones de busqueda
	//Handles search when te user types into the input component
	const handleQuery = (e) => {
		const value = e.target.value;
		// Las siguientes declaraciones if manejan si el usuario escribe letras en lugar de números cuando intenta buscar por ID
		//The following if statements handles if the user types letters instead of numbers when tries to search by ID
		if (queryOption == "borrower_id" && !onlyNumbers.test(value) && value != "") {
			e.target.textContent = value.match(/\d+/g);
			setvalidInput(false);
		} else {
			setvalidInput(true);
			setPageNumber(1);
			setQuery(value);
		}
	};

	//Maneja la creación de un nuevo prestatatario
	//Handles the creation of a new borrower
	const handleCreate = async () => {
		const element = await PersonaFormDialog("Nuevo Arrendatario", PersonaFullForm, PersonaFields, ContactFields);
		console.log(element);
		const resData = await CreateReq("/tenant", element, user.token);
		if (resData) {
			setPageNumber(1);
		}
	};

	const handleConfirmLending = async (borrower_id) => {
		const html = `<input id="lending_remarks" placeholder="Notas del prestamo"></input>`;

		const confirm = await ConfirmModal("info", "Confirmar el préstamo", "Confirmar", "Cancelar");

		if (confirm) {
			try {
				const notes = await ConfirmModal("info", "¿Desea agregar alguna nota?", "ok", "", html, "lending_remarks");
				const data = {
					user_id: user?.user_id,
					borrower_id: borrower_id,
					items: items,
					lending_remarks: notes || "",
				};

				const resData = await CreateReq("/api/lendings/createLending", data, user.token);
				if (resData.code == "ERR_NETWORK") {
					ModalAlert("error", "¡No se pudo conectar!", true);
					return;
				}
				if (resData?.lending_id) {
					ModalAlert("success", "¡Guardado!", true);

					navigate("/home/personas", { replace: true });
				} else {
					ModalAlert("error", "¡No se pudo guardar!", true);
				}
			} catch (error) {
				ModalAlert("error", "¡Hubo un error!", true);
			}
		} else {
			ModalAlert("error", "¡Hubo un error!", true);
		}
	};

	const inputSearchRef = useRef(null);

	const queryOptions = [
		{ value: "last_name", label: "Nombre/Propiedad" },
		{ value: "tenant_name", label: "Arrendatario" },
		{ value: "borrower_career", label: "Carrera" },
	];

	const careerOptions = [
		{ value: "", label: "Todos" },
		{ value: "ISC", label: "Ing. en Sistemas" },
		{ value: "LA", label: "Lic. en Administracióon" },
		{ value: "ICIV", label: "Ing. Civil" },
		{ value: "IIND", label: "Ing. Industrial" },
		{ value: "N/A", label: "N/A" },
	];

	return (
		<div className='HomeChildContainer Personas'>
			<div className='ChildMaster'>
				<div className='Personas tableHeader'>
					<h2>Arrendatarios</h2>
					<div className='Personas SearchOptions'>
						{/* <TabOptionsComponent handler={handleUserType} api='/api/personas/getTabs' tabOption='borrower_type' /> */}
						<div className='SearchOptionsRigtside'>
							<SelectComponent options={queryOptions} handler={handleQuery} />
							{queryOption == "borrower_career" && (
								<SelectComponent
									options={careerOptions}
									handler={(field, value, e) => {
										setPageNumber(1);
										setQuery(value);
									}}
								/>
							)}
							<SearchBar visible={queryOption != "borrower_career"} handler={handleQuery} validInput={validInput} refn={inputSearchRef} />
							<button
								className={`buttonKeepExpand ${keepExpand ? `Active` : ""}`}
								onClick={() => {
									setKeepExpand(!keepExpand);
								}}>
								<FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
							</button>
						</div>
					</div>
				</div>

				<div className='TableScroll'>
					<div className={`tableContainer ShowTableAnim ${tableData.length > 0 ? "Active" : ""}`}>
						{tableData.length > 0 &&
							tableData.map((object) => {
								if (tableData.length === tableData.lastIndexOf(object) + 1) {
									return (
										<div key={object._id} ref={lastElementRef}>
											<PersonasTableRow data={object} keepExpand={keepExpand} lend={items} handleConfirmLending={handleConfirmLending} />
										</div>
									);
								} else {
									return (
										<div key={object._id}>
											<PersonasTableRow data={object} keepExpand={keepExpand} lend={items} handleConfirmLending={handleConfirmLending} />
										</div>
									);
								}
							})}

						<div>{loading && <Loading />}</div>
						<div>{error && <Error />}</div>
						<div>{!loading && !error && tableData.length < 1 && <Error noResults={tableData.length < 1} />}</div>
					</div>
				</div>

				<div style={{ height: "100px" }}></div>
			</div>
			{!error && user.userType == "admin" && <OnCreateButton handler={handleCreate} />}
		</div>
	);
}

export default Tenants;
