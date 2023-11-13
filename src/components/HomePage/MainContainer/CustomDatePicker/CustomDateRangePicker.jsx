import './CustomDateRangePicker.css';
import 'rsuite/dist/rsuite.min.css';
import { useContext } from 'react';
import { ThemeContext } from '../../../../context/ThemeContext';
import { CustomProvider, DateRangePicker } from 'rsuite';

function CustomDateRangePicker({ handleRange }) {
	const { theme } = useContext(ThemeContext);

	return (
		<>
			<CustomProvider theme={theme}>
				<DateRangePicker
					placeholder='Seleccione fecha'
					showOneCalendar
					onChange={(e) => handleRange(e)}
				/>
			</CustomProvider>
		</>
	);
}

export default CustomDateRangePicker;
