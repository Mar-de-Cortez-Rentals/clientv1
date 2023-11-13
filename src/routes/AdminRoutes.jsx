import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.jsx';

function AdminRoutes({ element: Element, elementName }) {
	const { user } = useAuthContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(false);
	}, [user]);

	// Si isLoading es true, muestra un indicador de carga o un mensaje de espera
	if (isLoading) {
		return '';
	}

	return user.user_type === 'admin' ? (
		<Element />
	) : (
		<Navigate to='/home' replace />
	);
}

export default AdminRoutes;
