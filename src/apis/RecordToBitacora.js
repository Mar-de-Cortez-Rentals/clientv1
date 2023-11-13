import { CreateReq } from '../apis/ApiReqests';
import { ModalAlert } from '../components/Modals/Alerts/Alerts';

export const handleRegisterToBitacora = async (api, data, token) => {
	try {
		const response = await CreateReq(
			api,
			{
				history_type: data.history_type,
				history_description: data.history_description,
				user_id: data.user_id,
			},
			token
		);

		/* if (response?.history_id) {
			ModalAlert('success', 'Bitácora registrada');
		} else if (response?.code === 'ERR_NETWORK') {
			ModalAlert('error', 'No se pudo conectar');
		} else {
			ModalAlert('error', 'Hubo un error');
		} */
	} catch (err) {
		ModalAlert('error', 'Hubo un error en bitácora');
	}
};
