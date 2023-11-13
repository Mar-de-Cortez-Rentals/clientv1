import { useContext } from 'react';
import { ThemeContext } from '../../../../context/ThemeContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

function DarkLightButton() {
	const { theme, handleTheme } = useContext(ThemeContext);

	return (
		<div>
			<button
				className='theme-toggle-button'
				onClick={handleTheme}
				style={{ background: 'transparent', border: 'transparent' }}
			>
				<FontAwesomeIcon
					className='theme-toggle-icon'
					icon={theme == 'light' ? faSun : faMoon}
				/>
			</button>
		</div>
	);
}

export default DarkLightButton;
