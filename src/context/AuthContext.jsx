import { createContext, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return {
				user: action.payload,
			};

		case "LOGOUT":
			localStorage.removeItem("user");
			return {
				user: null,
			};

		case "UPDATE_USER":
			// Obtén el contenido actual del LocalStorage
			const existingData = JSON.parse(localStorage.getItem("user"));
			// Combinar el contenido existente con el payload
			const mergedData = { ...existingData, ...action.payload };

			localStorage.setItem("user", JSON.stringify(mergedData));
			return {
				user: action.payload,
			};

		default:
			return state;
	}
};

function AuthContextProvider({ children }) {
	const storedUser = JSON.parse(localStorage.getItem("user"));

	const [state, dispatch] = useReducer(authReducer, {
		user: storedUser || null,
	});

	return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
}

export { AuthContextProvider };
