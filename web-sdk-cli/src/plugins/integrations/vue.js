import ErrorHandler from "./default";
import {Logger} from "../../utils";

/**
 * @typedef {Object} VueErrorHandlerOptions
 * @property {callback} callback - Function
 */
class VueErrorHandler extends ErrorHandler {
    /**
     * @jsdoc
     * @param {VueErrorHandlerOptions} options
     */
    constructor(options) {
        super();
        this.callback = options.callback;
        Vue.config.errorHandler = this.errorHandler.bind(this);
    }
    errorHandler(msg, instance) {
        console.error(msg);
        let info = {
            msg : msg.toLocaleString(),
            file_url : window.location.href,
            error : msg.toString(),
            stack : msg.stack.toString()
        } ;
        this.callback(info);
    }
}

export default VueErrorHandler;