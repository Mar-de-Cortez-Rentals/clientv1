import './Reports.css';
import { useEffect, useContext } from 'react';
import { SectionContext } from '../../../context/SectionContext';
import { useAuthContext } from '../../../hooks/useAuthContext';

import ReportButton from '../../../components/HomePage/MainContainer/Buttons/ReportButton/ReportButton';

function Reports() {
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle('Reportes');
	}, []);

	const { user } = useAuthContext();

	const labs = [
		{
			title: 'Laboratorio de Redes',
			img: 'https://sergiomadrigal.com/wp-content/uploads/2013/10/blog_lab1.jpg',
			id: 1,
		},
		{
			title: 'Laboratorio de Programación',
			img: 'https://www.unosquare.com/wp-content/uploads/2021/10/Unosquare_14.webp',
			id: 2,
		},
		{
			title: 'Laboratorio de Computo',
			img: 'https://observatorio.tec.mx/wp-content/uploads/2019/01/computer-labs.jpg',
			id: 3,
		},
		{
			title: 'Laboratorio de Civil',
			img: 'https://www.comercializadorags.com/wp-content/uploads/2013/02/laboratorio-ingenieria-civil.jpg',
			id: 4,
		},
		{
			title: 'Laboratorio de Industrial',
			img: 'https://laboratorios.iteso.mx/wp-content/uploads/sites/3/2021/02/2wPTI_Manufacturaylogi%CC%81stica_OK_980x655.jpg',
			id: 5,
		},
		{
			title: 'Laboratorio de Mecatronica',
			img: 'http://4.bp.blogspot.com/-WKNPRHBLaNw/UJqdX-ZFjtI/AAAAAAAAAnA/5DRYo4fkrlo/s1600/S1670005.JPG',
			id: 6,
		},
	];

	return (
		<div className='HomeChildContainer Reports'>
			<h2>Reportes de laboratorio</h2>
			<div className='ReportSection'>
				{labs.map((lab) => {
					if (user.lab_id == lab.id || user.user_type === 'admin') {
						return (
							<ReportButton
								key={lab.id}
								query={{ report_lab_id: lab.id }}
								api={'/api/export/laboratory'}
								title={lab.title}
								img={lab.img}
							/>
						);
					} else {
						return null;
					}
				})}
			</div>
		</div>
	);
}

export default Reports;
