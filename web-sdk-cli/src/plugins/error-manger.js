import {Utils} from "../utils";

const END_POINT = 'error';

export class ErrorManager {
    /*
    sender: Sender = null;
    options: null;
    */

    // instance singleton
    static manager = null;

    /**
     *
     */
    _initializeQuery() {
        this.query = [];
        this.querySize = 0;
    }

    /**
     *
     */
    resetQuery() {
        this._initializeQuery();
    }

    /**
     *
     * @param options
     * @param sender
     */
    constructor(options, sender) {
        this.options = options;
        this.sender = sender;
        this._initializeQuery();
        this._configureEvent();
    }

    /**
     *
     * @private
     */
    _configureEvent() {
        if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.origin.startsWith('https'))) {
            return console.error('only https is allowed');
        }
        window.addEventListener("unhandledrejection", this._handleError.bind(this));
      //  window.onunhandledrejection = this._handleError.bind(this)
        window.onerror = this._handleError.bind(this);
    }

    /***
     *
     * @param msg
     * @param url
     * @param lineNo
     * @param columnNo
     * @param error
     * @private
     */
    _handleError(msg, url, lineNo, columnNo, error) {
        console.warn('_handleError');
        if (error){
            error = error.toString();
        }
        let string = msg.toLowerCase && msg.toLowerCase();
        let info;
        if (string) {
            var substring = "script error";
            if (string.indexOf(substring) > -1) {
                info = {msg, file_url: url, lineNo, columnNo, error}
            } else {
                info = {msg, file_url: url, lineNo, columnNo, error};
            }
        } else {
            let proto = msg.toString().replace(/\[object /ig, '')
            proto = proto.replace(/]$/g, '')
            info = {file_url: url, lineNo, columnNo, error: msg.reason.toString(), proto};
        }
        let data = Object.assign({}, {url: location.href}, {
            info
        });

        this.push(data);
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
    push(body) {
        body = Object.assign({}, body, {browser: Utils.getBrowserParams()});
        this.sender.push({data: body, endpoint: END_POINT})
    }
}

export default ErrorManager;
