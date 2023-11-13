import '../FormDialogs/FormDialogs.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

function getTheme() {
	return localStorage.getItem('theme');
}

export function ConfirmModal(icon, title, acceptBtn, cancelBtn, html, id) {
	return new Promise((resolve, reject) => {
		Swal.fire({
			icon: icon,
			title: title,
			toast: false,
			timer: false,
			showConfirmButton: acceptBtn ? true : false,
			showCancelButton: cancelBtn ? true : false,
			confirmButtonText: acceptBtn,
			cancelButtonText: cancelBtn,
			allowOutsideClick: false,
			allowEscapeKey: false,
			html: html,

			didOpen: () => {
				const currentTheme = getTheme();
				const container = Swal.getContainer();
				container.setAttribute('data-theme', `${currentTheme}`);
			},

			preConfirm: () => {
				if (html != null) {
					const notas = document.getElementById(id);
					resolve(notas.value);
				} else {
					resolve(true);
				}
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
				/* closeButton: '...', */
				/* 
			inputLabel: '...',
			validationMessage: '...',
			actions: '...',
			
			denyButton: '...',
			
			loader: '...',
			footer: '....',
			timerProgressBar: '....', */
			},
		});
		return confirm;
	});
}
