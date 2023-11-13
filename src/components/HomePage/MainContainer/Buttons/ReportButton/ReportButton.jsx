import './ReportButton.css';
import { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import { useAuthContext } from '../../../../../hooks/useAuthContext';
import { GetReq } from '../../../../../apis/ApiReqests';
import { ModalAlert } from '../../../../Modals/Alerts/Alerts';
import { flattenObject } from '../../../../../helpers/flattenObjects';

function ReportButton({ title, img, api, query }) {
	const [loading, setLoading] = useState(false);

	const { user } = useAuthContext();

	//Maneja la petición al servidor y luego crea el archivo excel con los datos, finalmente lo descarga
	//Handles the request to the server and then creates the excel file with the data, finally downloads it
	const handleGetData = async () => {
		setLoading(true);

		try {
			const response = await GetReq(api, query, user.token);

			if (response?.code == 'ERR_NETWORK') {
				ModalAlert('error', '¡No se pudo conectar!', true);
				return;
			}
			if (!response?.inventoryData) {
				ModalAlert('error', 'Hubo un error!', false);
			}

			const flattenedPendingLendingsData = response.PendingLendingsData.map(
				(lending) => {
					const flattenedLending = Object.assign({}, lending);
					Object.assign(flattenedLending, lending.user);
					Object.assign(flattenedLending, lending.borrower);
					delete flattenedLending.user;
					delete flattenedLending.borrower;
					return flattenedLending;
				}
			);

			const flattenedReturnedLendingsData = response.ReturnedLendingsData.map(
				(lending) => {
					const flattenedLending = Object.assign({}, lending);
					Object.assign(flattenedLending, lending.user);
					Object.assign(flattenedLending, lending.borrower);
					delete flattenedLending.user;
					delete flattenedLending.borrower;
					return flattenedLending;
				}
			);

			var wb = utils.book_new();

			var ws = utils.json_to_sheet(response.inventoryData);
			utils.book_append_sheet(wb, ws, 'Inventario');

			var ws2 = utils.json_to_sheet(flattenedPendingLendingsData);
			utils.book_append_sheet(wb, ws2, 'Préstamos Devueltos');

			var ws3 = utils.json_to_sheet(flattenedReturnedLendingsData);
			utils.book_append_sheet(wb, ws3, 'Préstamos Pendientes');

			var ws4 = utils.json_to_sheet(response.pendingBorrowersData);
			utils.book_append_sheet(wb, ws4, 'Deudores Pendientes');

			writeFile(wb, `Reporte de ${title}.xlsx`);
		} catch (err) {
			ModalAlert('error', 'Hubo un error!', false);
		}

		setLoading(false);
	};

	return (
		<button
			className={`RoundedRect ImageButton Reports ${
				loading ? '' : 'NotLoading'
			}`}
			onClick={handleGetData}
		>
			<div className='imageTextContainer Reports'>
				<img src={img} />
				<div>
					<h4>{title}</h4>
				</div>
			</div>
			<div className={`loader ${loading ? '' : 'Hide'}`}></div>
		</button>
	);
}

export default ReportButton;
