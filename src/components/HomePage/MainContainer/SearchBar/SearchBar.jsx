import "./SearchBar.css";

function SearchBar({ handler, validInput, handlerTextbox, idInput, refn, defaultValue, visible, value }) {
	return (
		<input
			placeholder='Buscar...'
			type='text'
			className={`RoundedRect SearchBar ${validInput ? "" : "InvalidInput"} ${visible ? "" : "Hidden"}`}
			onChange={handler}
			onInput={idInput}
			onBlur={handlerTextbox}
			ref={refn}
			defaultValue={defaultValue}
			value={value}></input>
	);
}

export default SearchBar;
