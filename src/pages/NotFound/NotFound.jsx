import { useRouteError } from 'react-router-dom';

const NotFound = () => {
	const error = useRouteError();
	console.log(error);
	return (
		<div>
			<h2>You've landed on a wrong planet</h2>
			<h4>Route Not Found: 404</h4>
		</div>
	);
};

export default NotFound;
