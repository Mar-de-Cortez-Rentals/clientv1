import './UserComponent.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OnEditButtons from '../../Buttons/OnEditButtons/OnEditButtons';
import SelectComponent from '../../Select/SelectComponent';
import { UpdateReq } from '../../../../../apis/ApiReqests';
import { useAuthContext } from '../../../../../hooks/useAuthContext';

import { handleRegisterToBitacora } from '../../../../../apis/RecordToBitacora';
import { onlyNumbers } from '../../../../../helpers/regexes';
import { ModalAlert } from '../../../../Modals/Alerts/Alerts.jsx';
import { ConfirmModal } from '../../../../Modals/ConfirmModal/ConfirmModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faHashtag,
	faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

function UserComponent({ data, labNameDistincts, userTypeDistincts }) {
	const [expand, setExpand] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [rowData, setRowData] = useState(data);
	const [edited, setEdited] = useState(false);

	const { user } = useAuthContext();

	const navigate = useNavigate();

	/*  const [recentBit, setRecentBit] = useState({}); */
	/* 	const handleGetRecentBitacora = async () => {
		try {
			const recentBit = await GetReq(
				'/api/bitacora/getRecentBitacora',
				{ user_id: rowData.user_id },
				user.user_id
			);

			console.log(recentBit);

			if (recentBit?.response.status == 200) {
				setRecentBit(recentBit?.data);
			}
		} catch (err) {
			console.log(err);
			ModalAlert('error', '¡No se pudo conectar!', true);
		}
	};

	useEffect(() => {
		handleGetRecentBitacora();
	}, []); */

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
			'/api/users/updateUser',
			rowData,
			user.token
		);
		if (resData.code == 'ERR_NETWORK') {
			ModalAlert('error', '¡No se pudo conectar!', true);
			return;
		}
		if (resData.user_id) {
			setRowData((prev) => (prev = { ...rowData, ...resData }));
			ModalAlert('success', '¡Guardado!', true);
			await handleRegisterToBitacora(
				'/api/bitacora/create',
				{
					history_type: 'Modificación',
					history_description: `Modificó su perfil (${rowData.user_fullname}, ID: ${rowData.user_id})`,
					user_id: user.user_id,
				},
				user.token
			);
		} else if (resData.response && resData.response.status == 409) {
			setRowData((prev) => prev);
			ModalAlert('error', '¡ID existente, verifique!', true, 2500);
		} else {
			setRowData((prev) => prev);
			ModalAlert('error', '¡No se pudo guardar!', true);
		}
		IDInputRef.current.textContent = rowData.user_id;
	};

	//Maneja la función de cancelación de edición en los campos relevantes, por lo que vuelve al contenido de vistas previas
	//Handles the cancel edit function to the relevant fields, so it gets back to the previews content
	function handleCancelEdit() {
		setRowData((prev) => (prev = data));
		setEdited(false);
		IDInputRef.current.textContent = rowData.user_id;
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

	const handleSeeProfile = () => {
		/* navigate(`/profile/${rowData.user_id}`); */

		ConfirmModal('info', '¡Próximamente!, Perfiles de usuario...', 'Ok');
	};

	const IDInputRef = useRef(null);

	const roleOptions = [
		{ value: 'admin', label: 'Administrador' },
		{ value: 'normal', label: 'Laboratorista' },
		{ value: 'inactivo', label: 'Inactivo' },
	];

	/* 	const labOptions = [
		{ value: 'Redes', label: 'Redes' },
		{ value: 'Programación', label: 'Programación' },
		{ value: 'Cómputo', label: 'Cómputo' },
		{ value: 'Civil', label: 'Civil' },
		{ value: 'Industrial', label: 'Industrial' },
	]; */

	const labOptions = [
		...labNameDistincts,
		{ value: labNameDistincts.length + 1, label: 'No asignado' },
	];

	return (
		<div
			className='UserCard TableRow'
			onMouseLeave={() => {
				setExpand(false);
			}}
		>
			<div className='CardHeader'>
				<img
					style={{ opacity: '.5' }}
					className='UserPhoto'
					src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
					alt='user'
				/>
				<div className='UserNameArea'>
					<div>
						<h4>{rowData.user_fullname}</h4>
						<p className='Email'>
							<span>
								<FontAwesomeIcon icon={faPaperPlane} />
							</span>{' '}
							{rowData.user_email}
						</p>
						<p className='EmpNumb'>
							<span>
								<FontAwesomeIcon icon={faHashtag} />
							</span>{' '}
							Numero de empleado:{' '}
							<span
								onInput={(e) => handleValidId(e)}
								contentEditable={isEditing}
								onBlur={(e) => {
									e.target.textContent == ''
										? (e.target.textContent = rowData.user_id)
										: handleEditData('new_user_id', e.target.textContent);
								}}
								suppressContentEditableWarning
								ref={IDInputRef}
							>
								{rowData.user_id}
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className='CardBody'>
				<div>
					<p>Rol: </p>
					<SelectComponent
						options={roleOptions}
						handler={handleEditData}
						disable={!isEditing}
						defaultSelected={
							rowData?.user_type ? rowData?.user_type : 'inactivo'
						}
						field={'user_type'}
					/>
				</div>
				<div>
					<p>lab: </p>
					<SelectComponent
						options={labOptions && labOptions}
						handler={handleEditData}
						disable={!isEditing}
						defaultSelected={
							rowData?.lab_id ? rowData?.lab_id : labNameDistincts.length + 1
						}
						field={'lab_id'}
					/>
				</div>
			</div>

			<div className={`WeekBitacora ${expand ? 'Expand' : ''}`}>
				<div className='EditButtons'>
					{isEditing ? (
						''
					) : (
						<button className='SeeProfile' onClick={handleSeeProfile}>
							Ver pefil
						</button>
					)}
					<OnEditButtons
						handleEditField={(value) => {
							setIsEditing(value);
						}}
						isEditing={isEditing}
						cancelEdit={handleCancelEdit}
						handleUpdateReq={handleUpdateReq}
					/>
				</div>
			</div>
			<div
				className={`ExpandBar ${expand || isEditing ? '' : 'Show'}`}
				onClick={handleExpand}
			>
				<FontAwesomeIcon icon={faCaretDown} />
			</div>
		</div>
	);
}

export default UserComponent;
