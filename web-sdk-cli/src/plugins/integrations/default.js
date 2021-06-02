class ErrorHandler {
    callback;

    /**
     *
     * @param msg
     * @param url
     * @param lineNo
     * @param columnNo
     * @param error
     *
     */
    handleError(msg, url, lineNo, columnNo, error) {
        console.error(msg);
        if (error) {
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
            info = {msg :msg.reason.toString(), file_url: url, lineNo, columnNo, error: msg.toLocaleString(), proto};
        }
        this.callback(info);
    }
}

export default ErrorHandler;