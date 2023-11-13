import { useCallback, useEffect, useRef } from "react";

const useInfinitScrolling = (loading, hasMore, setPageNumber) => {
	const observer = useRef();

	const lastElementRef = useCallback(
		(node) => {
			if (observer.current) {
				observer.current.disconnect(); // Desconecta el observer anterior antes de crear uno nuevo
			}

			loading
				? null
				: (observer.current = new IntersectionObserver((entries) => {
						if (entries[0].isIntersecting && hasMore) {
							setPageNumber((prevPageNumber) => prevPageNumber + 1);
						}
				  }));
			if (node) observer.current.observe(node);
		},
		[hasMore, setPageNumber]
	);

	useEffect(() => {
		return () => {
			// Limpia el observer cuando el componente es desmontado
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, []);

	return lastElementRef;
};

export default useInfinitScrolling;
