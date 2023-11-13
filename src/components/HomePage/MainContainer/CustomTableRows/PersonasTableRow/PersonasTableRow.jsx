import './PersonasTableRow.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { UpdateReq } from '../../../../../apis/ApiReqests';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { onlyNumbers } from '../../../../../helpers/regexes';

import { handleRegisterToBitacora } from '../../../../../apis/RecordToBitacora';
import { ModalAlert } from '../../../../Modals/Alerts/Alerts';
import OnEditButtons from '../../Buttons/OnEditButtons/OnEditButtons';
import SelectComponent from '../../Select/SelectComponent';
import Textbox from '../../Textbox/Textbox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

function PersonasTableRow({ data, keepExpand, lend, handleConfirmLending }) {
	//Guarda los estados de las variables representadas en los componentes
	//Saves the states for the variables rendered in the components
	const [expand, setExpand] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [rowData, setRowData] = useState(data);
	const [edited, setEdited] = useState(false);

	const { user } = useAuthContext();

	//Maneja la función de edición de los campos relevantes
	//Handles the edit function to the relevant fields
	function handleEditData(field, e) {
		setRowData((prev) => (prev = { ...rowData, [field]: e }));
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
			'/api/personas/updatePersona',
			rowData,
			user.token
		);
		if (resData?.code == 'ERR_NETWORK') {
			ModalAlert('error', '¡No se pudo conectar!', true);
			return;
		}
		if (resData?.borrower_id) {
			setRowData((prev) => (prev = { ...rowData, ...resData }));
			ModalAlert('success', '¡Guardado!', true);
			await handleRegisterToBitacora(
				'/api/bitacora/create',
				{
					history_type: 'Modificación',
					history_description: `Se modificó el prestatario: ${rowData.borrower_fullname}, con ID: ${rowData.borrower_id}`,
					user_id: user.user_id,
				},
				user.token
			);
		} else if (resData?.response && resData?.response.status == 409) {
			setRowData((prev) => prev);
			ModalAlert('error', '¡ID existente, verifique!', true, 2500);
		} else {
			setRowData((prev) => prev);
			ModalAlert('error', '¡No se pudo guardar!', true);
		}
		IDInputRef.current.textContent = rowData.borrower_id;
	};

	//Maneja la función de cancelación de edición en los campos relevantes, por lo que vuelve al contenido de vistas previas
	//Handles the cancel edit function to the relevant fields, so it gets back to the previews content
	function handleCancelEdit() {
		setRowData((prev) => (prev = data));
		setEdited(false);
		IDInputRef.current.textContent = rowData.borrower_id;
	}

	//Maneja la funcionalidad de expandir la tarjeta de información
	//Handles the expand functionality of the row
	function handleExpand() {
		setExpand(!expand);
	}

	//maneja el id introducido por el usuario que intenta editarlo, por lo que solo puede permitir números
	//handle the id introduced by the user when he tries to edit it, so it can only allow numbers
	const handleValidId = (e) => {
		const value = e.target.textContent;
		if (!onlyNumbers.test(value)) {
			e.target.textContent = value.replace(/\D/g, '');
		}
	};

	//Maneja la función de pegar texto plano en los campos editables del item
	//Handles the paste function to the editable fields of the item
	const handlePaste = (e) => {
		e.preventDefault();
		// Obtener el texto plano pegado sin formato
		const plainText = e.clipboardData.getData('text/plain');
		e.target.textContent = plainText;
	};

	const IDInputRef = useRef(null);

	const borrower_career_Options = [
		{ value: 'ISC', label: 'Ing. en Sistemas ' },
		{ value: 'LA', label: 'Lic. en Administración' },
		{ value: 'ICIV', label: 'Ing. Civil' },
		{ value: 'IIND', label: 'Ing. Industrial' },
		{ value: 'N/A', label: 'N/A (No aplica)' },
	];

	const borrower_type_Options = [
		{ value: 'Estudiante', label: 'Estudiante' },
		{ value: 'Docente', label: 'Docente' },
		{ value: 'Administrativo', label: 'Administrativo' },
		{ value: 'Externo', label: 'Externo' },
	];

	return (
		<div
			className={`Persona TableRow`}
			onMouseLeave={() => {
				setExpand(false);
			}}
		>
			{user.user_type == 'normal' && lend && (
				<div className='EditButtons Lendings ConfirmDiv'>
					<button
						className={isEditing ? 'DisabledConfirmLending' : 'ConfirmLending'}
						onClick={() => {
							handleConfirmLending(rowData.borrower_id);
						}}
					>
						Confirmar para prestar
					</button>
				</div>
			)}
			<div className='ShowedInfo Personas'>
				<div className='HeaderPersonaCard'>
					<div className='PersonaInfo'>
						{isEditing ? (
							<div>
								<Textbox
									placeHolder={'Nombre(s)'}
									field={'borrower_name'}
									defaultValue={rowData.borrower_name}
									handler={handleEditData}
									HandleValidity={() => {}}
								/>
								<Textbox
									placeHolder={'Apellido(s)'}
									field={'borrower_lastname'}
									defaultValue={rowData.borrower_lastname}
									handler={handleEditData}
									HandleValidity={() => {}}
								/>
							</div>
						) : (
							<h3>{rowData.borrower_fullname}</h3>
						)}
						<SelectComponent
							options={borrower_career_Options}
							defaultSelected={rowData.borrower_career}
							handler={handleEditData}
							field={'borrower_career'}
							disable={!isEditing}
						/>
					</div>

					<div className='PersonaMoreInfo'>
						<p>
							{rowData.borrower_type == 'Estudiante' && `Número de control:`}
							{rowData.borrower_type == 'Docente' && `Número de empleado:`}
							{rowData.borrower_type == 'Administrativo' &&
								`Número de empleado:`}
							{rowData.borrower_type == 'Externo' && `ID:`}{' '}
							<span
								onInput={(e) => handleValidId(e)}
								contentEditable={isEditing}
								onBlur={(e) => {
									e.target.textContent == ''
										? (e.target.textContent = rowData.borrower_id)
										: handleEditData('new_borrower_id', e.target.textContent);
								}}
								suppressContentEditableWarning
								ref={IDInputRef}
								onPaste={handlePaste}
							>
								{rowData.borrower_id}
							</span>
						</p>
						<SelectComponent
							options={borrower_type_Options}
							defaultSelected={rowData.borrower_type}
							handler={(field, value) => {
								handleEditData(field, value);
							}}
							field={'borrower_type'}
							disable={!isEditing}
						/>
					</div>
				</div>
			</div>

			<div
				className={`Personas Expandible ${
					keepExpand || expand || isEditing ? 'Show' : ''
				}`}
			>
				<div>
					<h3>Notas</h3>
					<p
						contentEditable={isEditing}
						onBlur={(e) =>
							handleEditData('borrower_notes', e.target.textContent)
						}
						suppressContentEditableWarning
						onPaste={handlePaste}
					>
						{rowData.borrower_notes}
					</p>
				</div>

				<div className='InteractiveButtons Lendings'>
					{rowData.lendings.length > 0 && (
						<p>
							<Link to={`../lendings/${rowData.borrower_fullname}`}>
								{rowData.lendings.length > 0 &&
									`Prestamos pendientes: ${rowData.lendings.length}`}
							</Link>
						</p>
					)}
					{user.user_type == 'normal' && (
						<>
							{/* 	<button className='DeleteButton' onClick={handleDelete}>
								Eliminar
							</button> */}
							<div>
								<OnEditButtons
									handleUpdateReq={handleUpdateReq}
									handleEditField={(value) => {
										setIsEditing(value);
									}}
									isEditing={isEditing}
									cancelEdit={handleCancelEdit}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			<div
				className={`ExpandBar ${
					keepExpand || expand || isEditing ? '' : 'Show'
				}`}
				onClick={handleExpand}
			>
				<FontAwesomeIcon icon={faCaretDown} />
			</div>
		</div>
	);
}

export default PersonasTableRow;
