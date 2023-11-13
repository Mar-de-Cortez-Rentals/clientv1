import './RegisterUserForm.css';
import { useState } from 'react';
import useSignup from '../../../hooks/Auth/useSignup';

import { validEmail, validPassword } from '../../../helpers/regexes';
import { ModalAlert } from '../../Modals/Alerts/Alerts';
import ButtonLogin from '../ButtonLogin/ButtonLogin.jsx';
import TextboxLogin from '../TextboxLogin/TextboxLogin.jsx';

import { faPaperPlane, faKey } from '@fortawesome/free-solid-svg-icons';

function RegisterUserForm(props) {
	const [userData, setUserData] = useState({
		user_id: '',
		user_name: '',
		user_lastname: '',
		user_email: '',
		user_password: '',
		user_password2: '',
	});

	const [emailValidation, setEmailValidation] = useState(true);
	const [passwordValidation, setPasswordValidation] = useState(true);
	const [password2Validation, setPassword2Validation] = useState(true);

	const { signup, error, isLoading } = useSignup();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!(
				emailValidation &&
				passwordValidation &&
				password2Validation &&
				userData.user_id != '' &&
				userData.user_name != '' &&
				userData.user_lastname != '' &&
				userData.user_email != '' &&
				userData.user_password != '' &&
				userData.user_password2 != ''
			)
		) {
			ModalAlert('error', 'Verifica los campos');
			return;
		}

		await signup(userData);

		if (error) {
			ModalAlert(
				'error',
				error?.response?.data || 'No hay conexión con el servidor',
				false,
				2500
			);
		} else {
			ModalAlert('success', 'Usuario registrado');
		}
	};

	return (
		<form
			className='FormRegister'
			action=''
			method='post'
			onSubmit={handleSubmit}
		>
			<TextboxLogin
				type='text'
				name='Name'
				id='username'
				placeholder='Nombre(s)'
				handler={(e) => setUserData({ ...userData, user_name: e.target.value })}
			/>
			<TextboxLogin
				type='text'
				name='Userlastname'
				id='Name'
				placeholder='Apellido(s)'
				handler={(e) =>
					setUserData({ ...userData, user_lastname: e.target.value })
				}
			/>
			<TextboxLogin
				type='text'
				name='Identification'
				id='userId'
				placeholder='Número de empleado'
				handler={(e) => setUserData({ ...userData, user_id: e.target.value })}
			/>
			<TextboxLogin
				type='email'
				name='Email'
				id='useremail'
				placeholder='Email'
				icon={faPaperPlane}
				handler={(e) =>
					setUserData({ ...userData, user_email: e.target.value })
				}
				HandleValidity={(e) => {
					setEmailValidation(
						validEmail.test(userData.user_email) || e.target.value == ''
					);
				}}
				validity={emailValidation}
			/>
			<TextboxLogin
				type='password'
				name='Password'
				id='userpassword'
				placeholder='Contraseña'
				icon={faKey}
				handler={(e) =>
					setUserData({ ...userData, user_password: e.target.value })
				}
				HandleValidity={(e) => {
					setPasswordValidation(
						validPassword.test(userData.user_password) || e.target.value == ''
					);
				}}
				validity={passwordValidation}
			/>
			<TextboxLogin
				type='password'
				name='Password'
				id='userpassword2'
				placeholder='Confirmar Contraseña'
				handler={(e) =>
					setUserData({ ...userData, user_password2: e.target.value })
				}
				HandleValidity={(e) => {
					setPassword2Validation(
						(validPassword.test(userData.user_password2) &&
							userData.user_password == userData.user_password2) ||
							e.target.value == ''
					);
				}}
				validity={password2Validation}
			/>
			<ButtonLogin
				className='btnRegister cardInputs'
				value={props.btnValue}
				disabled={isLoading}
			></ButtonLogin>
		</form>
	);
}

export default RegisterUserForm;
