import { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import localeConfig from '../../date-fns.locale.js';

function useDateFormater(ISODate) {
	//Variables de estado usadas para guardar los valores de las fechas relativas y fechas con formato legible despues de ser transformadas desde el formato ISO
	//State Variables used to store the value of relave date and formatted date once is tranformed from the ISO Format
	const [relativeDate, setRelativeDate] = useState('');
	const [formatedDate, setFormatedDate] = useState('');

	useEffect(() => {
		//Si la variable contiene valor, entonces realiza las conversiones
		//If the variable ISOdate is not empty, the it proceeds transforming the date
		if (ISODate) {
			//Transforma la fecha a una frase que determina la distancia de la fecha del momento actual
			//Transforms the date to a prhase like 'a day ago', so it gets the distances of the date from now
			setRelativeDate(
				formatDistanceToNow(parseISO(ISODate), {
					addSuffix: true,
					...localeConfig,
				})
			);
			//Transforma la fecha por una mas legible, como por ejemplo: '9 de diciembre del 2022, 12:50 PM'
			//Transfomrs the date for a more legible one to the Spanish format, like '9 de diciembre del 2022, 12:50 PM'
			setFormatedDate(
				format(parseISO(ISODate), "d 'de' MMMM 'del' yyyy, hh:mm a", {
					...localeConfig,
				})
			);
		}
	}, [ISODate]);
	//Devuelve las variable de estado que contienen los nuevos formatos
	//Returns the state variables, with the transformed dates
	return { relativeDate, formatedDate };
}

export default useDateFormater;
