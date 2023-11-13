import './LendingsTableRow.css';
import { useState, useEffect } from 'react';
import useDateFormater from '../../../../../hooks/useDateFormater';
import { UpdateReq } from '../../../../../apis/ApiReqests';
import { useAuthContext } from '../../../../../hooks/useAuthContext';

import { handleRegisterToBitacora } from '../../../../../apis/RecordToBitacora';
import { DeleteReq } from '../../../../../apis/ApiReqests';

import { ConfirmModal } from '../../../../Modals/ConfirmModal/ConfirmModal';
import { ModalAlert } from '../../../../Modals/Alerts/Alerts';
import OnEditButtons from '../../Buttons/OnEditButtons/OnEditButtons.jsx';

import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LendingsTableRow({ data }) {
	//Guarda los estados de las variables representadas en los componentes
	//Saves the states for the variables rendered in the components
	const [expand, setExpand] = useState(false); //This one is to expand the row itself
	const [isEditable, setIsEditable] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showMore, setShowMore] = useState(false); //This one is to expand the list of items insite the rows
	const [rowData, setRowData] = useState(data);
	const [edited, setEdited] = useState(false);
	const [resData, setResData] = useState();
	const [hideComponent, setHideComponent] = useState(false);

	const { user } = useAuthContext();

	//Se encarga de que las fechas de la base de datos sean más comprensibles para los humanos
	//Takes care of making the dates from the database more comprehensible for humans
	const { relativeDate: borrowRelativeDate, formatedDate: borrowFormatedDate } =
		useDateFormater(rowData.lending_borrowdate);

	//Igual que el anterior pero esto es para la fecha de devolución del préstamo
	//Same as the above one but this is for the return date of the lending
	const {
		/* relativeDate: returnedRelativeDate, */ //Not used variable from the custom hook
		formatedDate: returnedFormatedDate,
	} = useDateFormater(rowData.lending_returneddate);

	//Maneja la función de edición de los campos relevantes
	//Handles the edit function to the relevant fields
	function handleEditData(field, e) {
		setRowData(
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
		const resData = await UpdateReq(
			'/api/lendings/updateLending',
			rowData,
			user.token
		);
		if (resData?.code == 'ERR_NETWORK') {
			ModalAlert('error', '¡No se pudo conectar!', true);
			return;
		}
		if (resData?.lending_id) {
			setRowData((prev) => (prev = { ...rowData, ...resData }));
			ModalAlert('success', '¡Guardado!', true);
			await handleRegisterToBitacora(
				'/api/bitacora/create',
				{
					history_type: 'Modificación',
					history_description: `Se modificó el préstamo con ID: ${rowData.lending_id}`,
					user_id: user.user_id,
				},
				user.token
			);
		} else {
			ModalAlert('error', '¡No se pudo guardar!', true);
		}
	};

	const handleReturnLending = async () => {
		const resData = await UpdateReq(
			'/api/lendings/returnLending',
			{
				lending_id: rowData.lending_id,
				id_items: rowData.items.map((item) => item.items.item_id),
			},
			user.token
		);
		if (resData?.code == 'ERR_NETWORK') {
			ModalAlert('error', '¡No se pudo conectar!', true);
			return;
		}
		if (resData?.returned) {
			setRowData((prev) => (prev = { ...rowData, ...resData }));
			setResData(resData);
			ModalAlert('success', '¡Hecho!', true);
		} else {
			ModalAlert('error', '¡Hubo un error!', true);
		}
	};

	const handleCancelReturn = async () => {
		const resData = await UpdateReq(
			'/api/lendings/cancelReturnLending',
			{
				lending_id: rowData.lending_id,
				id_items: rowData.items.map((item) => item.items.item_id),
			},
			user.token
		);
		if (resData.code == 'ERR_NETWORK' || resData?.response?.status > 300) {
			ModalAlert('error', '¡No se pudo conectar!', true);
			return;
		}
		if (!resData?.returned) {
			setRowData((prev) => (prev = { ...rowData, ...resData }));
			setResData(resData);
			ModalAlert('info', 'Operación cancelada', true);
		} else {
			ModalAlert('error', '¡Hubo un error!', true);
		}
	};

	//Maneja la función de cancelación de edición en los campos relevantes, por lo que vuelve al contenido de vistas previas
	//Handles the cancel edit function to the relevant fields, so it gets back to the previews content
	function handleCancelEdit() {
		setRowData((prev) => (prev = { ...prev, ...resData }));
	}

	//Maneja la función de eliminación de un registro
	//Handles the delete function of a record
	const handleDelete = async () => {
		const confirm = await ConfirmModal(
			'info',
			'¿Desea eliminar?',
			'Confirmar',
			'Cancelar'
		);

		const items = rowData.items.map((item) => item.items.item_id);

		try {
			if (confirm) {
				const deleteResponse = await DeleteReq(
					'/api/lendings/deleteLending',
					{ lending_id: rowData.lending_id, items: items },
					user.token
				);
				if (deleteResponse?.lending_id) {
					ModalAlert('success', '¡Eliminado!', true);
					setHideComponent(true);
					await handleRegisterToBitacora(
						'/api/bitacora/create',
						{
							history_type: 'Eliminación',
							history_description: `Se eliminó el préstamo con ID: ${deleteResponse.lending_id}`,
							user_id: user.user_id,
						},
						user.token
					);
				} else if (deleteResponse?.code == 'ERR_NETWORK') {
					ModalAlert('error', '¡No se pudo conectar!', true);
				} else {
					ModalAlert('error', '¡No se pudo eliminar!', true);
				}
			} else {
				ModalAlert('info', '¡Operación cancelada!', true);
			}
		} catch (err) {
			ModalAlert('error', '¡Ocurrió un error!');
		}
	};

	//Maneja la funcionalidad de expandir la tarjeta de información
	//Handles the expand functionality of the row
	function handleExpand() {
		setExpand(!expand);
	}

	//Maneja mostrar más elementos de los artículos en el préstamo
	//Handles showmore elements of the items in the lending
	function handleShowMore() {
		setShowMore(!showMore);
	}

	return (
		!hideComponent && (
			<div
				className='TableRow Expand'
				onMouseLeave={() => {
					setExpand(false);
					isDialogOpen && !expand ? setIsDialogOpen(false) : '';
				}}
			>
				<div className='ShowedInfo Lendings'>
					<div>
						<p>{borrowRelativeDate}</p>
						<h3>{`${rowData.borrower.borrower_name} ${rowData.borrower.borrower_lastname}`}</h3>
					</div>
					<div
						className='ReturnedIndicator'
						style={
							rowData.returned
								? { background: 'var(--gradient-accent)' }
								: { background: 'var(--secundary-bg)' }
						}
					>
						<p>{rowData.returned ? 'Devuelto' : 'Pendiente'}</p>
					</div>
				</div>

				<div className='CenterRow'>
					<div>
						<div>
							<h3>Materiales:</h3>
							<div className='ItemsList'>
								<ul className={showMore ? 'ShowMore' : ''}>
									{rowData.items.map((items) => {
										return (
											<li key={items.items.item_id}>{items.items.item_type}</li>
										);
									})}
								</ul>
								{rowData.items.length > 4 && (
									<button
										className='ShowMoreButton'
										onClick={() => {
											handleShowMore();
										}}
									>
										<FontAwesomeIcon
											icon={showMore ? faCaretUp : faCaretDown}
										/>
										<p>Ver {showMore ? 'menos' : 'más'}</p>
									</button>
								)}
							</div>
						</div>
					</div>

					<div>
						<p>
							ID de prestamo: <span>{rowData.lending_id}</span>
						</p>
						<div className='LendingDate'>
							<h4>Fecha de Prestamo: </h4>
							<p>{borrowFormatedDate}</p>
						</div>
						<div className='ReturnedDate'>
							{rowData.lending_returneddate && (
								<>
									<h4>Devuelto: </h4>
									<p>{returnedFormatedDate}</p>
								</>
							)}
						</div>

						<div className='AuthorizedBy'>
							<h4>
								Autorizó:{' '}
								<span>{`${rowData.user.user_name} ${
									rowData.user.user_lastname
								} ${
									rowData?.user?.user_jobposition
										? `(${rowData?.user?.user_jobposition})`
										: ''
								}`}</span>
							</h4>
						</div>
					</div>
				</div>

				<div
					className={`Expandible ${
						expand || isDialogOpen || isEditable ? 'Show' : ''
					}`}
				>
					<div>
						<h3>Notas</h3>
						<p
							contentEditable={isEditable}
							onBlur={(e) => handleEditData('lending_remarks', e)}
							suppressContentEditableWarning
						>
							{rowData.lending_remarks}
						</p>
					</div>
					{user.user_type == 'normal' && (
						<div className='InteractiveButtons Lendings'>
							<div className='EditButtons Lendings'>
								{!rowData.returned && !isEditable ? (
									<button
										onClick={handleReturnLending}
										className='ConfirmReturn'
									>
										Confirmar Devolución
									</button>
								) : null}
								{rowData.returned && !data.returned ? (
									<button className='CancelButton' onClick={handleCancelReturn}>
										Cancelar devolución
									</button>
								) : null}
							</div>
							<div></div>
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
									cancelEdit={handleCancelEdit}
								/>
							</div>
						</div>
					)}
				</div>

				<div
					className={`ExpandBar ${
						expand || isDialogOpen || isEditable ? '' : 'Show'
					}`}
					onClick={handleExpand}
				>
					<FontAwesomeIcon icon={faCaretDown} />
				</div>
			</div>
		)
	);
}

export default LendingsTableRow;
