import './FormDialogs.css';
import Swal from 'sweetalert2';

function getTheme() {
	return localStorage.getItem('theme');
}

export function PersonaFormDialog(title, Form, Fields) {
	return new Promise((resolve, reject) => {
		Swal.fire({
			title: title,
			html: Form,
			icon: 'info',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			showCloseButton: true,
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,

			didOpen: () => {
				const currentTheme = getTheme();
				const container = Swal.getContainer();
				container.setAttribute('data-theme', `${currentTheme}`);
			},

			preConfirm: () => {
				const borrowerIdInput = document.getElementById('borrower_id');
				const borrowerTypeInput = document.getElementById('borrower_type');
				const borrowerIdValue = borrowerIdInput?.value.trim();
				const borrowerTypeValue = borrowerTypeInput?.value;

				if (borrowerTypeValue !== 'Externo' && !/^\d+$/.test(borrowerIdValue)) {
					borrowerIdInput.setCustomValidity(
						'Este campo debe contener solo números'
					);
					borrowerIdInput.classList.add('InputError');
					return false;
				}

				borrowerIdInput.setCustomValidity('');
				borrowerIdInput.classList.remove('error');
				const formData = {};

				Fields.forEach((element) => {
					formData[element[0]] = document.getElementById(element[0]).value;
				});
				resolve(formData);
			},

			customClass: {
				container: 'SwalContainer ',
				popup: 'SwalPopup',
				header: 'SwalHeader',
				title: 'SwalTitle',
				icon: 'SwalIcon',
				image: 'SwalImage',
				input: 'SwalInput',
				confirmButton: 'SwalConfirmButton',
				htmlContainer: 'SwalHtmlContainer',
				cancelButton: 'SwalCancelButton',
			},
		});
	});
}
