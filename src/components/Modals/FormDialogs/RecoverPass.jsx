import './FormDialogs.css';
import Swal from 'sweetalert2';

function getTheme() {
	return localStorage.getItem('theme');
}

export function RecoverPass() {
	return new Promise((resolve, reject) => {
		Swal.fire({
			title: 'Ingrese su correo electrónico',
			html: ` <input id="user_email" class="SwalInput" type="email" placeholder="Correo electrónico" required />`,
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
				const user_email = document.getElementById('user_email');

				resolve(user_email.value);
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
