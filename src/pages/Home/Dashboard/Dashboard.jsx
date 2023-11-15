import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useContext, useEffect, useState } from "react";
import { SectionContext } from "../../../context/SectionContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { socket } from "../../../socket";
import "./Dashboard.scss";

function Dashboard() {
	const [data, setData] = useState([]);
	//Maneja el título de la barra de navegación superior
	//Handles the title for the upper navbar
	const { handleTitle } = useContext(SectionContext);
	useEffect(() => {
		handleTitle("Bienvenid@");

		fetch("http://localhost:3000/property/0/4")
			.then((res) => {
				res.json().then((data) => {
					setData(
						data.map((item) => {
							console.log({ property: item, ...MockData() });

							return { property: item, ...MockData() };
						})
					);
				});
			})
			.catch((err) => console.log(err));

		return () => {};
	}, []);

	const { user } = useAuthContext();

	const handleAddEvent = (value, index) => {
		socket.emit("message", value);
	};

	const [isConnected, setIsConnected] = useState(socket.connected);
	const [fooEvents, setFooEvents] = useState([]);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		function onFooEvent(value) {
			setFooEvents((previous) => [...previous, value]);
			setData((previous) => {
				return previous.filter((item) => item.property._id !== value.property._id);
			});
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("message", onFooEvent);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("message", onFooEvent);
		};
	}, []);

	return (
		<div className='HomeChildContainer Dashboard'>
			<div className='DashboardContainer'>
				<div className='ActionsContainer'>
					{/* <div>
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
					</div>  */}
					<div className='row'>
						{fooEvents.map((item, index) => {
							return (
								<div className={`col-md-3 px-4 py-4 animateCard`} style={{ background: "var(--tertiary-bg)", borderRadius: "2rem" }} key={index}>
									<div className='col-md pb-3'>
										<div className='row'>
											<img
												src={MockImages()}
												className='col-md shadow p-0'
												alt='...'
												style={{ borderRadius: "1rem", height: "100px", objectFit: "cover" }}
											/>
											<div className='col-md pt-3'>
												<h5 className='card-title'>
													Pago: {item.tenant.first_name} {item.tenant.last_name}
												</h5>
											</div>
										</div>
									</div>

									<div className='col-md'>
										<div className='row'>
											<div className='col-md'>
												<h5 className='card-title'>{item.property.name}</h5>
												<p className='card-text'>{item.property.address}</p>
											</div>

											<div className='col-md'>
												<h5 className='card-title'>
													Recibio: {item.admin.first_name} {item.admin.last_name}
												</h5>
											</div>

											<div className='col-md'>
												<h5 className='card-title'>
													Fecha:{" "}
													{formatDistanceToNow(parseISO(item.date), {
														addSuffix: true,
														...{
															locale: es,
														},
													})}
												</h5>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<div className='DashboardContainer'></div>

			<div className='DashboardContainer'>
				<div className='CarouselContainer p-4'>
					<div className='row'>
						{data.map((item, index) => {
							return (
								<div className='col-md-3' key={index}>
									<div className={`card shadow mockPendingPatCard animateCard`}>
										<img src={MockImages()} className='card-img-top' alt='...' />
										<div className='card-body'>
											<h5 className='card-title'>{item.property.name}</h5>
											<p className='card-text'>{item.property.address}</p>
											<a
												className='btn btn-primary'
												style={{ borderRadius: "1rem" }}
												onClick={() => {
													handleAddEvent(item, index);
												}}>
												<p className='text' style={{ color: "var(--tertiary-bg)" }}>
													Confirmar pago
												</p>
											</a>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;

const MockImages = () => {
	const data = [
		"https://img10.naventcdn.com/avisos/18/00/90/75/26/43/720x532/1104741056.jpg",
		"https://http2.mlstatic.com/D_NQ_NP_786367-MLM69746404598_062023-O.webp",
		"https://gpvivienda.com/blog/wp-content/uploads/2023/03/ralph-ravi-kayden-mR1CIDduGLc-unsplash-1-1-1024x680.jpg",
		"https://fincaraiz.com.co/blog/wp-content/uploads/2022/08/casas-modernas-1-1920x1130.jpg",
	];

	return data[Math.floor(Math.random() * data.length)];
};

const MockData = () => {
	const data = [
		{
			tenant: { first_name: "Juan", last_name: "Perez", phone: "1234567890", email: "" },
			admin: { first_name: "Hermana ", last_name: "Galvez 1" },
			date: new Date(),
			index: 0,
		},
		{
			tenant: { first_name: "Lidia", last_name: "Susano", phone: "1234567890", email: "" },
			admin: { first_name: "Hermana ", last_name: "Galvez 2" },
			date: new Date(),
			index: 1,
		},
		{
			tenant: { first_name: "Frank", last_name: "CInco", phone: "1234567890", email: "" },
			admin: { first_name: "Hermana ", last_name: "Galvez 3" },
			date: new Date(),
			index: 2,
		},
		{
			tenant: { first_name: "Tulio", last_name: "Palazueloz", phone: "1234567890", email: "" },
			admin: { first_name: "Hermana ", last_name: "Galvez 4" },
			date: new Date(),
			index: 3,
		},
	];

	return data[Math.floor(Math.random() * data.length)];
};
