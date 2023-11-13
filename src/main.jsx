import '../src/Style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';

import { AuthContextProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { SectionContextProvider } from './context/SectionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AuthContextProvider>
			<ThemeContextProvider>
				<SectionContextProvider>
					<RouterProvider router={router} />
				</SectionContextProvider>
			</ThemeContextProvider>
		</AuthContextProvider>
	</React.StrictMode>
);
