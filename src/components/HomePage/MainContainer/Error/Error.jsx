import './Error.css';

function Error({ noResults }) {
	return (
		<div className='Error'>
			{noResults ? 'Sin resultados...' : 'Algo salió mal...'}
		</div>
	);
}

export default Error;
