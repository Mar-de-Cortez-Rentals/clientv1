import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminRoute from "./AdminRoutes.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

import Dashboard from "../pages/Home/Dashboard/Dashboard.jsx";
import Home from "../pages/Home/Home.jsx";
import Leases from "../pages/Home/Leases/Leases.jsx";
import ProfilePage from "../pages/Home/ProfilePage/ProfilePage.jsx";
import Properties from "../pages/Home/Properties/Properties.jsx";
import Reports from "../pages/Home/Reports/Reports.jsx";
import Tenants from "../pages/Home/Tenants/Tenants.jsx";
import UsersManagement from "../pages/Home/UsersManagement/UsersManagement.jsx";
import Login from "../pages/Login/Login.jsx";
import NonAthorized from "../pages/NonAuthorized/NonAthorized.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";

export const router = createBrowserRouter([
	{
		path: "/nonAuthorized",
		element: <PrivateRoute element={NonAthorized} elementName={"NonAuth"} />,
	},
	{
		path: "/",
		element: <Navigate to='/login' replace />,
	},
	{
		path: "/login",
		element: <PrivateRoute element={Login} elementName={"Login"} />,
		errorElement: <NotFound />,
	},
	{
		path: "/home",
		element: <PrivateRoute element={Home} elementName={"Home"} />,
		errorElement: <NotFound />,
		children: [
			{
				path: "",
				element: <Navigate to='dashboard' replace />,
			},
			{
				path: "dashboard",
				element: <Dashboard />,
			},
			{ path: "inventory", element: <Properties /> },
			{ path: "lendings", element: <Leases /> },
			{ path: "lendings/:id", element: <Leases /> },
			{ path: "personas", element: <Tenants /> },
			{ path: "personas/:items", element: <Tenants /> },
			{
				path: "usersmanagement",
				element: <AdminRoute element={UsersManagement} />,
			},
			{ path: "reports", element: <Reports /> },
			{ path: "profile", element: <ProfilePage /> },
		],
	},
	{ errorElement: <NotFound /> },
]);
