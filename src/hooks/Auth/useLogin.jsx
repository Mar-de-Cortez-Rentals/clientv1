import { useState } from "react";
import { useAuthContext } from "../useAuthContext";

function useLogin() {
	const [isLoading, setIsLoading] = useState(false);

	const { dispatch } = useAuthContext();

	const login = async (data) => {
		setIsLoading(true);
		try {
			/* const response = await axios({
				method: "post",
				url: `${API_URL}/api/auth/login`,
				data: data,
			});

			if (response.status === 200) {
				localStorage.setItem("user", JSON.stringify(response.data));

				dispatch({ type: "LOGIN", payload: response.data });
			} */

			dispatch({ type: "LOGIN", payload: userData });
			localStorage.setItem("user", JSON.stringify(userData));

			setIsLoading(false);
			return response;
		} catch (err) {
			setIsLoading(false);
			return err;
		}
	};

	return { login, isLoading };
}

export default useLogin;

const userData = {
	_id: "f2dasdasdq3424q4",
	name: "Alex Verdugo",
	email: "alexhid14@gmail.com",
	password: "",
	userType: "admin",
};
