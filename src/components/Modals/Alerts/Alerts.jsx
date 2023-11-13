import './Alerts.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

function getTheme() {
	return localStorage.getItem('theme');
}

export function ModalAlert(icon, title, toast, time) {
	Swal.fire({
		position: 'top-end',
		icon: icon,
		title: title,
		toast: toast,
		showConfirmButton: false,
		timer: time || 1500,

		didOpen: () => {
			const currentTheme = getTheme();
			const container = Swal.getContainer();
			container.setAttribute('data-theme', `${currentTheme}`);
		},

		customClass: {
			container: 'SwalContainer ',
			popup: 'SwalPopup',
			header: 'SwalHeader',
			title: 'SwalTitle',
			/* closeButton: '...', */
			icon: 'SwalIcon',
			image: 'SwalImage',
			/* htmlContainer: '...',
			input: '...',
			inputLabel: '...',
			validationMessage: '...',
			actions: '...',
			confirmButton: '...',
			denyButton: '...',
			cancelButton: '...',
			loader: '...',
			footer: '....',
			timerProgressBar: '....', */
		},
	});
}
