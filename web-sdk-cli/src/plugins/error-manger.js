import {Utils, Sender} from "../utils";

const ERROR_EVENT = 'error';

export class ErrorManager {
    /*
    sender: Sender = null;
    options: null;
    */


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
        // Listen to mousemove
        window.onerror = (function (message, source, lineno, colno, error) {
            let body = document.body,
                html = document.documentElement;
            let height = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            let px = (event.clientX + document.documentElement.scrollLeft) / screen.width * 100;
            let py = (event.clientY + document.documentElement.scrollTop) / height * 100;
            this.pushToQuery({
                px: px,
                py: py,
                at: Date.now(),
                error: arguments[1]
            });

            console.log(message)
        }).bind(this);
    }

    /**
     * @param data {EventPosition}
     */
    pushToQuery(data) {
        this.query.push(data);
        this.querySize += JSON.stringify(data).length * 8;
        if (this.querySize > 256000) {
            this.push(this.query);
            this.resetQuery();
        }
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
