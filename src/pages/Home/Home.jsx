import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "./Home.css";

import { Outlet } from "react-router-dom";
import RightAside from "../../components/HomePage/MainContainer/RightAside/RightAside.jsx";
import UpperNav from "../../components/HomePage/MainContainer/UpperNav/UpperNav.jsx";
import LogoSideMenu from "../../components/HomePage/Sidemenu/LogoSideMenu/LogoSideMenu.jsx";
import SideMenu from "../../components/HomePage/Sidemenu/SideMenu.jsx";

function Home() {
	const { theme } = useContext(ThemeContext);
	const [shortSideMenu, setShortSideMenu] = useState(false);

	const handleSidebar = () => {
		setShortSideMenu(!shortSideMenu);
	};

	return (
		<>
			<div className='HomePrimaryContainer' data-theme={theme}>
				<aside className={`SideMenuContainer ${shortSideMenu ? "Short" : ""}`}>
					<LogoSideMenu isShort={shortSideMenu} />
					<SideMenu handleSidebar={handleSidebar} isShort={shortSideMenu} />
				</aside>
				<div className='HomeMainContainer'>
					<UpperNav />
					<Outlet />
				</div>

				<div className='HomeRighSideContainer'>
					<RightAside />
				</div>
			</div>
		</>
	);
}

export default Home;
