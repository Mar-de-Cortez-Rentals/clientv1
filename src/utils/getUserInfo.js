import { UAParser } from 'ua-parser-js';
const parser = new UAParser();

export const getNavigatorInfo = () => {
	const userAgentData = parser.setUA(window.navigator.userAgent).getResult();
	return (
		userAgentData.browser.name +
		' v' +
		userAgentData.browser.major +
		', en ' +
		userAgentData.os.name +
		' ' +
		userAgentData.os.version
	);
};
