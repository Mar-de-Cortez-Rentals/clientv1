import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext.jsx";

function PrivateRoute({ element: Element, elementName }) {
	const { user } = useAuthContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(false);
	}, [user]);
	// Si isLoading es true, muestra un indicador de carga o un mensaje de espera
	if (isLoading) {
		return "";
	}

	const validUser = user && (user.userType == "admin" || user.userType == "normal");

	if (elementName == "Home" && !user) {
		return <Navigate to='/login' replace />;
	}
	if (elementName == "Home" && user && !validUser) {
		return <Navigate to='/nonAuthorized' replace />;
	}
	if (elementName == "NonAuth" && !user) {
		return <Navigate to='/login' replace />;
	}
	if (elementName == "NonAuth" && validUser) {
		return <Navigate to='/home' replace />;
	}
	if (elementName == "NonAuth" && !user) {
		return <Navigate to='/login' replace />;
	}
	if (elementName == "Login" && user && !validUser) {
		return <Navigate to='/nonAuthorized' replace />;
	}
	if (elementName == "Login" && user && validUser) {
		return <Navigate to='/home' replace />;
	}
	return <Element />;
}

export default PrivateRoute;
