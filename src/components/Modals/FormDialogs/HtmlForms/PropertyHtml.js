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
	["name", "Nombre", ""],
	["address", "Dirección", ""],
	["type", "Tipo", "select"],
	["baseCost", "Costo Base", "number"],
];

const item_available_options = `<option value="casa">Casa</option>` + `<option value="apartamento">Apartamento</option>`;

export const ItemForm = ItemFields.map((element) => {
	if (element[2] === "select") {
		return `<select id="${element[0]}" class="swal2-select" >${item_available_options}</select>`;
	} else {
		return `<input id="${element[0]}" type="${element[2]}" min="0" class="swal2-input" placeholder="${element[1]}"/>`;
	}
}).join("");
