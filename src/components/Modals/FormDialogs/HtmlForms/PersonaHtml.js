export const PersonaFields = [
	['borrower_id', 'Número de control/empleado'],
	['borrower_name', 'Nombre'],
	['borrower_lastname', 'Apellido'],
	['borrower_type', 'Tipo de prestatario'],
	['borrower_career', 'Carrera/Academia'],
	['borrower_notes', 'Notas'],
];

const borrower_type_options =
	`<option value="Estudiante">Estudiante</option>` +
	`<option value="Docente">Docente</option>` +
	`<option value="Administrativo">Administrativo</option>` +
	`<option value="Externo">Externo</option>`;

const borrower_career_options =
	`<option value="ISC">Ing. en Sistemas</option>` +
	`<option value="LA">Lic. en Administración</option>` +
	`<option value="ICIV">Ing. Civil</option>` +
	`<option value="IIND">Ing. Industrial</option>` +
	`<option value="N/A">No aplica (N/A)</option>`;

export const PersonaForm = PersonaFields.map((element) => {
	`<p>Si el usuario es externo puede dejar el campo ID vacío.</p>`;
	if (element[0] === 'borrower_id') {
		return (
			`<p>Si el usuario es externo puede dejar el campo ID vacío.</p>` +
			`<input id="${element[0]}" class="swal2-input" pattern="^\d+$" placeholder="${element[1]}" required/>`
		);
	} else if (element[0] === 'borrower_type') {
		return `<select id="${element[0]}" class="swal2-select" >${borrower_type_options}</select>`;
	} else if (element[0] === 'borrower_career') {
		return `<select id="${element[0]}" class="swal2-select" >${borrower_career_options}</select>`;
	} else {
		return `<input id="${element[0]}" class="swal2-input" placeholder="${element[1]}"/>`;
	}
}).join('');
