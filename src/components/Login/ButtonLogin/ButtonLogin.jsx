import { el } from 'date-fns/locale';
import './ButtonLogin.css';
import { Link } from 'react-router-dom';

function ButtonLogin({ value, disabled }) {
	return (
		<input
			type='submit'
			value={value}
			disabled={disabled}
			className='btnLogin cardInputs'
		/>
	);
}

export default ButtonLogin;
