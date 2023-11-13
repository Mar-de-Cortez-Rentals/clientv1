/* const updatedItemFields = ItemFields.map((field) => {
	const fieldValue = object[field[2]]; // Obtener el valor correspondiente del objeto
	return [field[0], field[1], fieldValue];
}); */

/* const object = {
	item_type: 'asas',
	item_brand: 'as',
	item_model: 'aasas',
	item_description: 'assaa',
	item_available: 'true',
	item_remarks: 'sa',
};
 */

/* value = '${element[2] && element[2]}'; */

export const ItemFields = [
	['item_type', 'Nombre', ''],
	['item_brand', 'Marca', ''],
	['item_model', 'Modelo', ''],
	['item_description', 'Descripción', ''],
	['item_available', true, false],
	['item_remarks', 'Notas', ''],
];

const item_available_options =
	`<option value="true">Disponible</option>` +
	`<option value="false">No disponible</option>`;

export const ItemForm = ItemFields.map((element) => {
	if (element[0] === 'item_available') {
		return `<select id="${element[0]}" class="swal2-select" >${item_available_options}</select>`;
	} else {
		return `<input id="${element[0]}" class="swal2-input" placeholder="${element[1]}"/>`;
	}
}).join('');
