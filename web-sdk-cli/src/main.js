/**
 *
 */
import PageViewManager from './plugins/view-manager';
//import EventManager from './plugins/event-manger';
//import ErrorManager from './plugins/error-manger';
import {Logger, Sender} from './utils' ;


/**e
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
    if (!window.unkInitilaized) {
        options = options || {};
        config.token = token;
        config.debug = options.debug;
        Logger.setup(options);
        let sender = new Sender(config, options);
        PageViewManager.createManager(options, sender);
        window.unkInitilaized = true;
    }
    //new EventManager(options, sender);
    //new ErrorManager(options, sender);
};
window.unkAnalytics.version = config.version;