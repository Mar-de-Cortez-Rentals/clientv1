export const flattenObject = (obj, prefix = '') => {
	return Object.keys(obj).reduce((result, key) => {
		const nestedKey = `${prefix}${key}`;
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			Object.assign(result, flattenObject(obj[key], `${nestedKey}.`));
		} else {
			result[nestedKey] = obj[key];
		}
		return result;
	}, {});
};
