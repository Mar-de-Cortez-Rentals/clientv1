import { useContext } from "react";
import { SectionContext } from "../../../../context/SectionContext.jsx";
import { ThemeContext } from "../../../../context/ThemeContext.jsx";
import "./UpperNav.css";

import { faBars, faCaretLeft, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideMenu from "../../Sidemenu/SideMenu.jsx";

function UpperNav() {
	const { title } = useContext(SectionContext);
	const { theme, handleTheme } = useContext(ThemeContext);

	return (
		<>
			<nav className='UpperNav'>
				<div className='ShowMenu' data-bs-toggle='offcanvas' href='#offcanvasSidebar'>
					<FontAwesomeIcon icon={faBars} />
				</div>
				<h2>{title}</h2>
				<div className='NavRightSide'>
					<button className='toggle-button themeicon' onClick={handleTheme}>
						<FontAwesomeIcon className='theme-toggle-icon' icon={theme == "light" ? faSun : faMoon} />
					</button>
					<button
						className='toggle-button'
						onClick={() => {
							alert("Not implemented show right side");
						}}>
						<FontAwesomeIcon icon={faCaretLeft} className='ShowRight' />
					</button>
				</div>
			</nav>

			<div className='offcanvas offcanvas-start' tabIndex={-1} id='offcanvasSidebar' aria-labelledby='offcanvasSidebar' style={{ width: "300px" }}>
				{/* <div class='offcanvas-header' style={{ background: "var(--secundary-bg)" }}>
					<div className='d-flex flex-row gap-2 justify-content-center align-items-center' style={{ height: "90%", width: "100%" }}>
						<img src='/Rentals.svg' alt='Logo' style={{ height: "100%" }} />

						<h3>Rentals</h3>
					</div>
				</div> */}
				<SideMenu offcanvas={true} />
			</div>
		</>
	);
}

export default UpperNav;
