import { useEffect } from 'react';
import './SelectComponent.css';

function SelectComponent({
	options,
	handler,
	field,
	disable,
	defaultSelected,
}) {
	return (
		<select
			className={`RoundedRect SelectCombo ${disable ? 'Disabled' : ''}`}
			onChange={(e) => handler(field, e.target.value, e)}
			disabled={disable}
			value={defaultSelected}
		>
			{options &&
				options.map((option, index) => {
					return (
						<option key={index} value={option.value} disabled={disable}>
							{option.label}
						</option>
					);
				})}
		</select>
	);
}

export default SelectComponent;
