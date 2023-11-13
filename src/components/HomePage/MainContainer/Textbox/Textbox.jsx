import './Textbox.css';
function Textbox({
	placeHolder,
	handler,
	field,
	defaultValue,
	type,
	HandleValidity,
	onPaste,
}) {
	return (
		<input
			onPaste={onPaste}
			className='Textbox'
			type={type ? type : 'text'}
			placeholder={placeHolder}
			onChange={(e) => {
				handler(field, e.target.value);
				HandleValidity(e);
			}}
			defaultValue={defaultValue}
		></input>
	);
}

export default Textbox;
