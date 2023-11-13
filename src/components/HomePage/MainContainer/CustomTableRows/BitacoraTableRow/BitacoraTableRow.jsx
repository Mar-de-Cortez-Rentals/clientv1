import './BitacoraTableRow.css';
import { useState } from 'react';
import useDateFormater from '../../../../../hooks/useDateFormater';
import { useAuthContext } from '../../../../../hooks/useAuthContext';

function BitacoraTableRow({ data }) {
	const [rowData, setRowData] = useState(data);

	const { user } = useAuthContext();

	//Se encarga de que las fechas de la base de datos sean más comprensibles para los humanos
	//Takes care of making the dates from the database more comprehensible for humans
	const { relativeDate, formatedDate } = useDateFormater(rowData.history_date);

	return (
		<div className='TableRow Expand BitacoraRow'>
			<p>{relativeDate}</p>
			<h5>{`< ${rowData.history_type} >`}</h5>
			<p>{rowData.history_description}</p>
			<p className='Date'>{formatedDate}</p>
			{user?.user_type === 'admin' && (
				<h5>Realizó: {rowData.user.user_fullname}</h5>
			)}
		</div>
	);
}

export default BitacoraTableRow;
