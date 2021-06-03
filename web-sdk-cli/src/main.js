/**
 *
 */
import PageViewManager from './plugins/view-manager';
import ErrorManager from './plugins/error-manger';
//import EventManager from './plugins/event-manger';
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
        ErrorManager.createManager(options, sender);
        PageViewManager.createManager(options, sender);
        window.unkInitilaized = true;
        // add attributes and shortcuts
        window.unkAnalytics.version = config.version;
        window.unkAnalytics.off = sender.off.bind(sender);
        window.unkAnalytics.on = sender.on.bind(sender);
    }
    //new EventManager(options, sender);
};