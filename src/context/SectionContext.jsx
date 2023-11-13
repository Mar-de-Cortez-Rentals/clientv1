import { createContext, useState } from 'react';

export const SectionContext = createContext();

const SectionContextProvider = ({ children }) => {
	const [title, setTitle] = useState('DashBoard');

	const handleTitle = (value) => {
		setTitle(value);
	};

	const data = { title, handleTitle };

	return (
		<SectionContext.Provider value={data}>{children}</SectionContext.Provider>
	);
};

export { SectionContextProvider };
