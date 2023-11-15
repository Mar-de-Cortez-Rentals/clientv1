import "./SelectComponent.css";

function SelectComponent({ options, handler, field, disable, defaultSelected, value }) {
	return (
		<select
			className={`RoundedRect SelectCombo ${disable ? "Disabled" : ""}`}
			onChange={(e) => handler(e.target.value, "")}
			disabled={disable}
			value={defaultSelected}>
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
