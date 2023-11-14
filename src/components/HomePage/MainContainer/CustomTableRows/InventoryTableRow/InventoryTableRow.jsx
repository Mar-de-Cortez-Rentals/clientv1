import { useState } from "react";
import { Link } from "react-router-dom";
import { DeleteReq, UpdateReq } from "../../../../../apis/ApiReqests.js";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import "./InventoryTableRow.css";

import { handleRegisterToBitacora } from "../../../../../apis/RecordToBitacora.js";
import { ModalAlert } from "../../../../Modals/Alerts/Alerts.jsx";
import { ConfirmModal } from "../../../../Modals/ConfirmModal/ConfirmModal.jsx";
import OnEditButtons from "../../Buttons/OnEditButtons/OnEditButtons.jsx";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InventoryTableRow({ data, selectedItems, handleSelected }) {
	//Guarda los estados de las variables representadas en los componentes
	//Saves the states for the variables rendered in the components
	const [expand, setExpand] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [hideComponent, setHideComponent] = useState(false);
	const [rowData, setRowData] = useState(data);
	const [edited, setEdited] = useState(false);
	const [isIncluded, setIsIncluded] = useState(selectedItems.includes(data._id));

	const { user } = useAuthContext();

	//Maneja la función de edición de los campos relevantes
	//Handles the edit function to the relevant fields
	function handleEditData(field, e) {
		setRowData(
			//Combina el campo editado con los datos anterioress
			//Merges the edited field with the previous data
			(prev) => (prev = { ...rowData, [field]: e.target.textContent })
		);
		setEdited(true);
	}

	//Maneja la solicitud de API para actualizar el registro en la base de datos
	//Handles the api request to update the record in the database
	const handleUpdateReq = async () => {
		if (!edited) {
			setEdited(false);
			return;
		}
		//Envía la solicitud de actualización al servidor
		//Sends the update request to the server
		const resData = await UpdateReq("/api/inventory/updateItem", rowData, user.token);
		if (resData?.code == "ERR_NETWORK") {
			ModalAlert("error", "¡No se pudo conectar!", true);
			return;
		}
		if (resData?._id) {
			setRowData((prev) => (prev = { ...rowData, ...resData }));
			ModalAlert("success", "¡Guardado!", true);
			await handleRegisterToBitacora(
				"/api/bitacora/create",
				{
					history_type: "Modificación",
					history_description: `Se modificó el item ${rowData.item_type}`,
					user_id: user.user_id,
				},
				user.token
			);
		} else {
			ModalAlert("error", "¡No se pudo guardar!", true);
		}
	};

	//Maneja la función de cancelación de edición en los campos relevantes, por lo que vuelve al contenido de vistas previas
	//Handles the cancel edit function to the relevant fields, so it gets back to the previews content
	function handleCancelEdit() {
		setRowData((prev) => (prev = data));
		setEdited(false);
	}

	//Maneja la función de eliminación de un registro
	//Handles the delete function of a record
	const handleDelete = async () => {
		setIsDialogOpen(true);
		const confirm = await ConfirmModal("info", "¡Esto eliminará lo prestamos asociados!", "Confirmar", "Cancelar");

		try {
			if (confirm) {
				const deleteResponse = await DeleteReq("/api/inventory/deleteItem", { _id: rowData._id }, user.token);
				if (deleteResponse?._id) {
					ModalAlert("success", "¡Eliminado!", true);
					setHideComponent(true);
					await handleRegisterToBitacora(
						"/api/bitacora/create",
						{
							history_type: "Eliminación",
							history_description: `Se eliminó el item ${rowData.type}`,
							user_id: user._id,
						},
						user.token
					);
				} else if (deleteResponse?.code == "ERR_NETWORK") {
					ModalAlert("error", "¡No se pudo conectar!", true);
				} else {
					ModalAlert("error", "¡No se pudo eliminar!", true);
				}
			} else {
				ModalAlert("info", "¡Operación cancelada!", true);
			}
		} catch (err) {
			ModalAlert("error", "¡Ocurrió un error!");
		}
	};

	const handleAvailability = async () => {
		try {
			const response = await UpdateReq("/api/inventory/updateAvalability", { _id: rowData._id, item_available: rowData.item_available }, user.token);
			if (response?._id) {
				setRowData((prev) => (prev = { ...rowData, ...response }));
			} else if (response?.response.status == 405) {
				ModalAlert("error", "¡Pertenece a un prestamo activo!");
			} else {
				ModalAlert("error", "¡Hubo un error!");
			}
		} catch (err) {
			ModalAlert("error", "¡Hubo un error!");
		}
	};

	//Maneja la funcionalidad de expandir la tarjeta de información
	//Handles the expand functionality of the row
	function handleExpand() {
		setExpand(!expand);
	}

	//Maneja la función de pegar texto plano en los campos editables del item
	//Handles the paste function to the editable fields of the item
	const handlePaste = (e) => {
		e.preventDefault();

		// Obtener el texto plano pegado sin formato
		// Get pasted unformatted plain text
		const plainText = e.clipboardData.getData("text/plain");
		e.target.textContent = plainText;
	};

	return (
		!hideComponent && (
			<div
				className='TableRow Expand'
				onMouseLeave={() => {
					setExpand(false);
					isDialogOpen && !expand ? setIsDialogOpen(false) : "";
				}}>
				<div className='ShowedInfo row'>
					<div style={{ display: "flex", gap: "25px" }} className='col-md'>
						{user.userType == "admin" && (
							<input
								className='SelectItem'
								type='checkbox'
								defaultChecked={isIncluded}
								onClick={(e) => {
									if (rowData?.item_available) {
										handleSelected(e, rowData?._id);
									} else {
										ModalAlert("error", "¡No disponible!", true);
										e.target.checked = false;
									}
								}}
							/>
						)}
						<div className='row w-100'>
							<div className='col-md'>
								<p>ID: {rowData?._id}</p>
								<h3 contentEditable={isEditable} onBlur={(e) => handleEditData("item_type", e)} suppressContentEditableWarning onPaste={handlePaste}>
									{rowData?.type}
								</h3>
							</div>
							<div className='col-md'>
								<h4>Dirección</h4>
								<p
									contentEditable={isEditable}
									onBlur={(e) => handleEditData("item_description", e)}
									suppressContentEditableWarning
									onPaste={handlePaste}>
									{rowData.address}
								</p>
							</div>
						</div>
					</div>

					{/* <div className='BrandModel'>
						<div>
							<h5>Marca: </h5>
							<p contentEditable={isEditable} onBlur={(e) => handleEditData("item_brand", e)} suppressContentEditableWarning onPaste={handlePaste}>
								{rowData?.baseCost}
							</p>
						</div>
						<div>
							<h5>Modelo: </h5>
							<p contentEditable={isEditable} onBlur={(e) => handleEditData("item_model", e)} suppressContentEditableWarning onPaste={handlePaste}>
								{rowData?.item_model}
							</p>
						</div>
					</div> */}
					<div className='col-md-auto'>
						<h4
							className='itemAvailable'
							style={{ color: rowData.item_available ? "#00c69f" : "#e56552" }}
							data-tooltip={rowData.item_available ? "" : "Revise notas.."}
							onClick={handleAvailability}>
							{rowData.item_available ? "Disponible" : "Plazo(s) vencido(s)"}
						</h4>
						{/* <div
							style={{
								display: "flex",
								gap: "5px",
								justifyItems: "flex-end",
								flexDirection: "row",
							}}>
							<h5>Lab: </h5>
							<p>{rowData?.lab?.lab_name}</p>
						</div> */}
					</div>
				</div>

				<div className={`Expandible ${expand || isDialogOpen || isEditable ? "Show" : ""}`}>
					<div>
						<h4>Dirección</h4>
						<p
							contentEditable={isEditable}
							onBlur={(e) => handleEditData("item_description", e)}
							suppressContentEditableWarning
							onPaste={handlePaste}>
							{rowData.address}
						</p>
					</div>
					<div>
						<h4>Notas</h4>
						<p contentEditable={isEditable} onBlur={(e) => handleEditData("item_remarks", e)} suppressContentEditableWarning onPaste={handlePaste}>
							{rowData.item_remarks}
						</p>
					</div>
					<div className='returnedNotes'>
						{rowData.lendings?.[0] && (
							<div>
								<span>En posesión de: </span>
								{rowData.lendings?.[0].lendings.borrower.borrower_name} {rowData.lendings?.[0].lendings.borrower.borrower_lastname}
								<span>{` (${rowData.lendings?.[0].lendings.borrower.borrower_type})`}</span>
							</div>
						)}
					</div>
					<div className='InteractiveButtons'>
						{rowData.lendings?.[0] && (
							<div className='EditButtons Lendings'>
								<button>
									<Link to={`../lendings/${rowData.lendings?.[0].lendings.lending_id}`}>Ver Prestamo</Link>
								</button>
							</div>
						)}
						{user.userType == "admin" && (
							<div className='EditButtons Delete'>
								<button className='DeleteButton' onClick={handleDelete}>
									Eliminar
								</button>
								<OnEditButtons
									handleUpdateReq={handleUpdateReq}
									handleEditField={(value) => {
										setIsEditable(value);
									}}
									isEditing={isEditable}
									cancelEdit={handleCancelEdit}></OnEditButtons>
							</div>
						)}
					</div>
				</div>

				<div className={`ExpandBar ${expand || isDialogOpen || isEditable ? "" : "Show"}`} onClick={handleExpand}>
					<FontAwesomeIcon icon={faCaretDown} />
				</div>
			</div>
		)
	);
}

export default InventoryTableRow;
