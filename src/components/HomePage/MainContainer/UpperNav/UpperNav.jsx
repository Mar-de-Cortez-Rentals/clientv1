import './UpperNav.css';
import { useContext } from 'react';
import { ThemeContext } from '../../../../context/ThemeContext.jsx';
import { SectionContext } from '../../../../context/SectionContext.jsx';

import {
	faBars,
	faCaretLeft,
	faMoon,
	faSun,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UpperNav() {
	const { title } = useContext(SectionContext);
	const { theme, handleTheme } = useContext(ThemeContext);

	return (
		<>
			<nav className='UpperNav'>
				<div
					className='ShowMenu'
					onClick={() => {
						alert('Not implemented show Menu');
					}}
				>
					<FontAwesomeIcon icon={faBars} />
				</div>
				<h2>{title}</h2>
				<div className='NavRightSide'>
					<button className='toggle-button themeicon' onClick={handleTheme}>
						<FontAwesomeIcon
							className='theme-toggle-icon'
							icon={theme == 'light' ? faSun : faMoon}
						/>
					</button>
					<button
						className='toggle-button'
						onClick={() => {
							alert('Not implemented show right side');
						}}
					>
						<FontAwesomeIcon icon={faCaretLeft} className='ShowRight' />
					</button>
				</div>
			</nav>
		</>
	);
}

export default UpperNav;
