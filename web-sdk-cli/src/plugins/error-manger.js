import {Utils} from "../utils";
import VuePlugin from "./integrations/vue";
import VueErrorHandler from "./integrations/vue";
import DefaultHandler from "./integrations/vanilla";

const END_POINT = 'error';

export class ErrorManager {
    /*
    sender: Sender = null;
    options: null;
    */
    handlers = [];
    // instance singleton
    static manager = null;

    /**
     *
     * @param options
     * @param sender
     */
    constructor(options, sender) {
        this.options = options;
        this.sender = sender;
        this._configureHandlers();
    }

    /**
     *
     * @private
     */
    _configureHandlers() {
        let options = {callback: this.push.bind(this)};
        // Vue
        if (typeof (Vue) != "undefined") {
            this.handlers.push(new VueErrorHandler(options));
        }
        // Vanilla
        this.handlers.push(new DefaultHandler(options));

    }

    static createManager(options, sender) {
        if (!ErrorManager.manager) {
            ErrorManager.manager = new ErrorManager(options, sender);
        }
        return ErrorManager.manager;
    }

    /**
     *
     */
    push(info) {
        let body = Object.assign({}, {browser: Utils.getBrowserParams(), url: location.href, info});
        this.sender.push({data: body, endpoint: END_POINT})
    }
}

export default ErrorManager;
