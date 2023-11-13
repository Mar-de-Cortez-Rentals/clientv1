import './TabOptionsComponent.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../../config';
import { useAuthContext } from '../../../../hooks/useAuthContext.jsx';

function TabOptionsComponent({ api, handler, tabOption }) {
	const [tabOptions, setTabOptions] = useState([]);

	const { user } = useAuthContext();

	useEffect(() => {
		axios({
			headers: { 'x-access-token': user.token },
			method: 'get',
			url: `${API_URL}${api}`,
			params: {
				tabOption: tabOption,
			},
		})
			.then((res) => {
				setTabOptions(res.data);
			})
			.catch((e) => {
				alert(e);
			});
	}, [api]);

	return (
		<div className='RollContainer'>
			<div className='RollItemsContainer'>
				<button
					value={''}
					className='TabOption Card'
					onClick={(e) => {
						handler(e);
					}}
				>
					Todos
				</button>
				{tabOptions.map((object, index) => {
					return (
						<button
							key={index}
							className='TabOption Card'
							onClick={(e) => {
								handler(e);
							}}
							value={object[tabOption]}
						>
							{object[tabOption]}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default TabOptionsComponent;
