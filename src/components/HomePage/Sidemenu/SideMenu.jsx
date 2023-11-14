import { useState } from "react";
import { Link } from "react-router-dom";
import "./SideMenu.css";

import { useAuthContext } from "../../../hooks/useAuthContext.jsx";
import ButtonMenu from "../MainContainer/Buttons/SideMenuButton/ButtonMenu.jsx";

import { faAngleLeft, faBed, faBuildingUser, faClipboardList, faHouse, faUserGear, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SideMenu({ handleSidebar, isShort, offcanvas }) {
	const [ShowMenu, setShowMenu] = useState(false);

	const { user } = useAuthContext();

	return (
		<div className='MenuandUser' style={offcanvas ? { borderRadius: 0 } : {}}>
			<button className={`hideMenuButton ${isShort ? "Rotate" : ""}`} onClick={handleSidebar}>
				{!offcanvas && (
					<div className={`ico`}>
						<FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
					</div>
				)}
			</button>
			<div className='MenuContainer'>
				<ul className='menuVertical'>
					<li className='menuHeader menuHeader1'>
						<span>Menú</span>
					</li>
					<li className='menuItem' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
						<ButtonMenu route='dashboard' title={!isShort ? `Dashboard` : ``} icon={faHouse} isShort={isShort}></ButtonMenu>
					</li>
					<li className='menuItem' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
						<ButtonMenu route='inventory' title={!isShort ? "Propiedades" : ``} icon={faBuildingUser} isShort={isShort}></ButtonMenu>
					</li>
					<li className='menuItem' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
						<ButtonMenu route='lendings' title={!isShort ? `Rentas` : ``} icon={faBed} isShort={isShort}></ButtonMenu>
					</li>
					<li className='menuHeader' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
						<span>Usuarios</span>
					</li>
					<li className='menuItem' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
						<ButtonMenu route='personas' title={!isShort ? "Arrendatarios" : ``} icon={faUserGroup} isShort={isShort}></ButtonMenu>
					</li>
					{user && user.userType === "admin" && (
						<li className='menuItem' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
							<ButtonMenu route='usersmanagement' title={!isShort ? "Manejo de usuarios" : ``} icon={faUserGear} isShort={isShort}></ButtonMenu>
						</li>
					)}

					<li className='menuHeader'>
						<span>Otros</span>
					</li>
					<li className='menuItem' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
						<ButtonMenu route='reports' title={!isShort ? "Reportes" : ``} icon={faClipboardList} isShort={isShort}></ButtonMenu>
					</li>
				</ul>
			</div>
			<div className='divGap'></div>
			<div className={`menuUserSection ${isShort ? "Short" : ""}`}>
				<Link to={"profile"} className='ImgA' data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
					<img
						src='https://static.wikia.nocookie.net/marveldatabase/images/c/c8/Wanda_Maximoff_%28Earth-199999%29_from_Doctor_Strange_in_the_Multiverse_of_Madness_Promo_001.jpg'
						alt='user'
					/>
				</Link>
				{!isShort && (
					<div>
						<Link to={"profile"} data-bs-dismiss={offcanvas ? "offcanvas" : ""}>
							<p>{user?.name}</p>
						</Link>
						<span>{user?.userType}</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default SideMenu;
