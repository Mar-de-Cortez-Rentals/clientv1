//FUTURA IMPLEMENTACIÓN

export const getLocation = async () => {
	// Obtener la latitud y longitud del usuario
	let latitude = null;
	let longitude = null;

	navigator.geolocation.getCurrentPosition(
		(position) => {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			console.log('Ubicación del usuario:', latitude, longitude);
		},
		(error) => {
			console.log('Error al obtener la ubicación:', error);
		}
	);

	// Hacer una solicitud a la API de geocodificación inversa de Google Maps
	const apiKey = 'TU_API_KEY';
	const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			// Verificar si se obtuvo una respuesta válida
			if (data.status === 'OK') {
				// Obtener los resultados de geocodificación
				const results = data.results;

				// Buscar la información de la calle y colonia en los resultados
				const addressResult = results.find(
					(result) =>
						result.types.includes('street_address') ||
						result.types.includes('route') ||
						result.types.includes('sublocality')
				);

				// Obtener el nombre de la calle o colonia
				const address = addressResult
					? addressResult.formatted_address
					: 'Dirección desconocida';

				console.log('Dirección del usuario:', address);
			} else {
				console.log('Error al obtener la dirección:', data.status);
			}
		})
		.catch((error) => {
			console.log('Error al obtener la dirección:', error);
		});
};
