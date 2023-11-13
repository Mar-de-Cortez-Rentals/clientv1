import './OnCreateButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function OnCreateButton({ handler, message }) {
	return (
		<button className='OnCreateButton' onClick={handler}>
			<span className='icon'>
				<FontAwesomeIcon icon={faPlus} />{' '}
			</span>
			<span className='text'>{message ? message : 'Nuevo'}</span>
		</button>
	);
}

export default OnCreateButton;
