import Swal from "sweetalert2";
import "./FormDialogs.css";

function getTheme() {
	return localStorage.getItem("theme");
}

export function PersonaFormDialog(title, Form, Fields, ContactFields) {
	return new Promise((resolve, reject) => {
		Swal.fire({
			title: title,
			html: Form,
			icon: "info",
			showCancelButton: true,
			cancelButtonText: "Cancelar",
			showCloseButton: true,
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,

			didOpen: () => {
				const currentTheme = getTheme();
				const container = Swal.getContainer();
				container.setAttribute("data-theme", `${currentTheme}`);
			},

			preConfirm: () => {
				const formData = {};
				const contact_info = {};

				Fields.forEach((element) => {
					formData[element[0]] = document.getElementById(element[0]).value;
				});

				ContactFields.forEach((element) => {
					contact_info[element[0]] = document.getElementById(element[0]).value;
				});

				resolve({
					...formData,
					contact_info: { ...contact_info },
				});
			},

			customClass: {
				container: "SwalContainer ",
				popup: "SwalPopup",
				header: "SwalHeader",
				title: "SwalTitle",
				icon: "SwalIcon",
				image: "SwalImage",
				input: "SwalInput",
				confirmButton: "SwalConfirmButton",
				htmlContainer: "SwalHtmlContainer",
				cancelButton: "SwalCancelButton",
			},
		});
	});
}
