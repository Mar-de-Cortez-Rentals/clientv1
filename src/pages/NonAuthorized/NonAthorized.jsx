import './NonAthorized.css';
import { useContext } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import LogoSideMenu from '../../components/HomePage/Sidemenu/LogoSideMenu/LogoSideMenu';

function NonAthorized() {
	const { theme, handleTheme } = useContext(ThemeContext);
	const { dispatch } = useAuthContext();
	const handleLogout = () => {
		dispatch({
			type: 'LOGOUT',
		});
	};
	return (
		<div className='UnAuthorized' data-theme={theme}>
			<div>
				<div className='LogoContainer'>
					<LogoSideMenu />
				</div>
				<h1>Bienvenido</h1>
				<br />
				<h3>
					Aun no ha sido dado de alta en el sistema, por favor contacte al
					administrador.
				</h3>
				<br />
				<button className='RoundedRect LogOut' onClick={handleLogout}>
					Cerrar sesión
				</button>
			</div>
		</div>
	);
}

export default NonAthorized;
