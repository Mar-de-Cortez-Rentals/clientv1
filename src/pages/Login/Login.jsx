import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import Styles from "./Login.module.scss";

import { AuthRequest } from "../../apis/AuthApiRequest";
import LoginUserForm from "../../components/Login/LoginUserForm/LoginUserForm.jsx";
import RegisterUserForm from "../../components/Login/RegisterUserForm/RegisterUserForm.jsx";
import { ModalAlert } from "../../components/Modals/Alerts/Alerts";
import { RecoverPass } from "../../components/Modals/FormDialogs/RecoverPass";
import LogoSVG from "./components/LogoSVG/LogoSVG.jsx";
import WavesSVG from "./components/WavesSVG/WavesSVG.jsx";

function Login() {
	const { theme, handleTheme } = useContext(ThemeContext);
	const [mouseOver, setMouseOver] = useState(false);
	const [showRegister, setShowRegister] = useState(false);

	const handleShowRegister = () => {
		setShowRegister((prev) => !prev);
	};

	const handleRecoverPass = async () => {
		const res = await RecoverPass();

		try {
			const response = await AuthRequest("/api/auth/recover", {
				user_email: res,
			});

			if (response?.status === 200) {
				ModalAlert("success", "Se envió un correo con instrucciones", false, 2500);
			} else if (response?.response?.status === 404) {
				ModalAlert("error", "Correo no valido o inexistente");
			} else {
				ModalAlert("error", "Ocurrió un error");
			}
		} catch (err) {
			ModalAlert("error", "Error", "");
		}
	};

	return (
		<>
			<div className={Styles.PrimaryContainer}>
				<div className={``}>
					<WavesSVG ShowRegister={showRegister} />
				</div>
				<div className={`${Styles.LogoContainer}`} onClick={() => handleTheme(theme == "dark" ? "light" : "dark")}>
					<LogoSVG handleTheme={handleTheme} expand={showRegister} />
				</div>
				<div className={`${Styles.Superposition}`}>
					<div className='h-100'>
						<div className={`${Styles.SignContainer}`}>
							<div className={`${Styles.LoginContainer}`}>
								<div className={`${Styles.Register} ${showRegister ? Styles.ShowRegister : ""} align-items-center d-flex flex-column`}>
									<h1 className='RegisterText'>Cree una cuenta</h1>
									<RegisterUserForm btnValue='Registrar'></RegisterUserForm>
									<button className={`${Styles.BackButton}`} onClick={handleShowRegister}>
										Volver
									</button>
								</div>
								<div className={`${Styles.Login} ${showRegister ? Styles.ShowRegister : ""} align-items-center d-flex flex-column`}>
									<h1 className='RegisterText'>¡Bienvenido!</h1>
									<LoginUserForm btnValue='Iniciar Sesión' handleRecoverPass={handleRecoverPass}></LoginUserForm>
									<button className={`${Styles.BackButton}`} onClick={handleShowRegister}>
										¿No tiene cuenta?
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;

export const Loginaa = () => {
	return (
		<>
			<div className={`${showLogin} RegisterContainer`}>
				<h1 className='RegisterText'>Cree una cuenta</h1>
				<RegisterUserForm btnValue='Registrar'></RegisterUserForm>
				<button className='BackButton' onClick={handleShow}>
					Volver
				</button>
			</div>
			<div className={`${showLogin} LoginContainer`}>
				<h1 className='RegisterText'>¡Bienvenido!</h1>
				<LoginUserForm btnValue='Iniciar Sesión'></LoginUserForm>
				<button className='BackButton' onClick={handleRecoverPass}>
					¿Olvidó su contraseña?
				</button>
				<button className='BackButton' onClick={handleShow}>
					¿No tiene cuenta?
				</button>
			</div>
		</>
	);
};
