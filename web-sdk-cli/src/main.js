/**
 *
 */
import PageViewManager from './plugins/view-manager';
//import EventManager from './plugins/event-manger';
//import ErrorManager from './plugins/error-manger';
import {Sender} from './utils' ;


/**
 *
 * @type {{agent: string, ui: {w: number, h: number}}}
 */
let config = {
	apiURL: 'SDK_API_HOST',
	version: 'SDK_VERSION',
	wsURL: 'PUSH_URL',
	token: null
};
/**
 *
 * @param token
 * @param options
 */
window.unkAnalytics = function (token, options) {
	config.token = token;
	let sender = new Sender(config);
	new PageViewManager(options, sender);
	//new EventManager(options, sender);
	//new ErrorManager(options, sender);
};
window.unkAnalytics.version = config.version;
