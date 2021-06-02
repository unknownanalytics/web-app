import ErrorHandler from "./default";

class DefaultHandler extends ErrorHandler {

    /**
     * @jsdoc
     * @param {VueErrorHandlerOptions} options
     */
    constructor(options) {
        super();
        this.callback = options.callback;
        // native js
        //  window.addEventListener("unhandledrejection", this._handleError.bind(this));
        window.onunhandledrejection = this.handleError.bind(this)
        window.onerror = this.handleError.bind(this);
    }

}

export default DefaultHandler;