import { useAuthContext } from '../useAuthContext';

function useLogout() {
	const { dispatch } = useAuthContext();

	const logout = () => {
		// Eliminar usuario del local storage
		// Remove user from local storage and set current user to null
		localStorage.removeItem('user');

		// Eliminar usuario del contexto
		// Remove user from context
		dispatch({ type: 'LOGOUT' });
	};

	return { logout };
}

export default useLogout;
