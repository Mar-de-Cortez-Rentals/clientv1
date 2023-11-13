import './TextboxLogin.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function TextboxLogin({
	icon,
	type,
	name,
	id,
	placeholder,
	handler,
	HandleValidity,
	validity,
}) {
	return (
		<div className='cardInputsContainer'>
			{icon && <FontAwesomeIcon className='faIconsLogin' icon={icon} />}
			<input
				className={`cardInputs ${
					validity || validity != '' ? 'validInput' : 'invalidInput'
				}`}
				type={type}
				name={name}
				id={id}
				placeholder={placeholder}
				onChange={handler}
				onBlur={HandleValidity}
			></input>
		</div>
	);
}

export default TextboxLogin;
