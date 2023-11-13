import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionContext } from "../../../context/SectionContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import "./Dashboard.css";

import CustomSlider from "../../../components/HomePage/MainContainer/Sliders/CustomSlider";

function Dashboard() {
	//Maneja el título de la barra de navegación superior
	//Handles the title for the upper navbar
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle("Bienvenid@");
		return () => {};
	}, []);

	const { user } = useAuthContext();

	return (
		<div className='HomeChildContainer Dashboard'>
			<div className='DashboardContainer'>
				<div className='ActionsContainer'>
					<div>
						<Link className='RoundedRect ImageButton' to={"../inventory"}>
							<button className='RoundedRect ImageButton'>
								<div className='imageTextContainer'>
									<img src='https://t3.ftcdn.net/jpg/01/03/74/84/360_F_103748444_vY2FIbRx86d969BLEMbCQ610Pkx6m3OX.jpg' />
									<div>
										<h4>{user?.user_type == "admin" ? "Ir a inventario" : "Registrar Prestamo"}</h4>
									</div>
								</div>
							</button>
						</Link>

						<Link className='RoundedRect ImageButton' to={"../lendings"}>
							<button className='RoundedRect ImageButton'>
								<div className='imageTextContainer'>
									<img
										className='Image2'
										src='https://s3-eu-central-1.amazonaws.com/eurosender-blog/wp-content/uploads/2017/04/19130136/returned-to-shipper-min.jpg'
									/>
									<div>
										<h4>{user?.user_type == "admin" ? "Ir a prestamos" : "Devolución de prestamo"}</h4>
									</div>
								</div>
							</button>
						</Link>
					</div>

					<div className='SecondRow'>
						<a className='RoundedRect ImageButton' href='https://www.tecnm.mx/'>
							<img src='https://www.cdcuauhtemoc.tecnm.mx/wp-content/uploads/2021/08/Logo-TecNM.png' />
						</a>
						<a className='RoundedRect ImageButton' href='https://www.puertopenasco.tecnm.mx/'>
							<img src='https://www.talent-network.org/comunidades/wp-content/uploads/2020/03/Instituto-Tecnologico-Superior-de-Puerto-Penasco.png' />
						</a>
						<a className='RoundedRect ImageButton' href='https://www.facebook.com/TecNMPuertoPenasco'>
							<img src='https://privacyinternational.org/sites/default/files/styles/teaser_large_x1/public/2020-06/Facebook400x230.png.webp?itok=mRsS3Vli' />
						</a>
					</div>
				</div>
			</div>

			<div className='DashboardContainer'></div>

			<div className='DashboardContainer'>
				<div className='CarouselContainer'>
					<CustomSlider></CustomSlider>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
