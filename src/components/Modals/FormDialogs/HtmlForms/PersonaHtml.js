export const PersonaFields = [
	["first_name", "Nombre", "text"],
	["last_name", "Apellido", "text"],
];
export const ContactFields = [
	["phone", "Teléfono", "text"],
	["email", "Correo", "text"],
	["job", "Trabajo", "text"],
	["job_phone", "Teléfono de trabajo", "text"],
	["job_address", "Dirección de trabajo", "text"],
];

export const PersonaForm = PersonaFields.map((element) => {
	return `<input id="${element[0]}" type='${element[2]}'class="swal2-input" placeholder="${element[1]}"/>`;
}).join("");

export const ContactForm = ContactFields.map((element) => {
	return `<input id="${element[0]}" type='${element[2]}'class="swal2-input" placeholder="${element[1]}"/>`;
}).join("");

export const PersonaFullForm = `<div class="swal2-row"> ${PersonaForm} </div> <div class="swal2-row"> ${ContactForm} </div>`;
