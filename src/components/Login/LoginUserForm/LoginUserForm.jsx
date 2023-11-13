import { useState } from "react";
import useLogin from "../../../hooks/Auth/useLogin";
import "./LoginUserForm.css";

import { ModalAlert } from "../../Modals/Alerts/Alerts";
import ButtonLogin from "../ButtonLogin/ButtonLogin.jsx";
import TextboxLogin from "../TextboxLogin/TextboxLogin.jsx";

import { faKey, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function LoginUserForm(props) {
	const [userData, setUserData] = useState({
		email: "",
		password: "",
	});

	const { login, isLoading } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!(userData.email != "" && userData.password != "")) {
			ModalAlert("error", "Verifica los campos");
			return;
		}

		const response = await login(userData);

		if (response?.code === "ERR_NETWORK") {
			ModalAlert("error", "No hay conexión con el servidor", false, 2500);
			return;
		}
		if (response?.response?.status === 401 || response?.response?.status === 500) {
			ModalAlert("error", response?.response?.data, false, 2500);
			return;
		}
		ModalAlert("success", "Iniciando sesión");

		/* await handleRegisterToBitacora(
			"/api/bitacora/create",
			{
				history_type: "Inició sesión",
				history_description: "Ingresó al sistema desde: " + getNavigatorInfo(),
				_id: response.data._id,
			},
			response.data.token
		); */
	};

	return (
		<form className='FormLogin' action='' method='get' onSubmit={handleSubmit}>
			<TextboxLogin
				type='email'
				name='Email'
				id='loginUserEmail'
				placeholder='Email'
				icon={faPaperPlane}
				handler={(e) => setUserData({ ...userData, email: e.target.value })}
			/>
			<TextboxLogin
				type='password'
				name='Password'
				id='loginUserPassword'
				placeholder='Contraseña'
				icon={faKey}
				handler={(e) => {
					setUserData({ ...userData, password: e.target.value });
				}}
			/>
			<button className={`BackButton`} onClick={props.handleRecoverPass}>
				¿Olvidó su contraseña?
			</button>
			<ButtonLogin className='btnRegister cardInputs' value={props.btnValue} disabled={isLoading} />
		</form>
	);
}

export default LoginUserForm;
