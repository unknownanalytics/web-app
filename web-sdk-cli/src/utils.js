const Logger = {
    debug: false,
    setup(options) {
        Logger.debug = options.debug;
    },
    log(info) {
        Logger.debug && console.log("%c unk-sdk :", 'background: red');
        Logger.debug && console.log("unk-sdk :", info);
    }
}

/**
 *
 */
class Sender {
    /*
    wsInstance: WebSocket = null;
    config: {} = null;*/
    isOff = false;

    constructor(config) {
        this.config = config;
        this.debug = config.debug;
        // WS is not supported
        /*if (!this.wsInstance) {
                this.wsInstance = this._initWS();
        }*/
    }

    off() {
        this.isOff = true;
        Logger.log("turning unk off");
    }

    on() {
        this.isOff = false;
        Logger.log("turning unk on");
    }

    /*
        /!**
         *
         * @returns {null|WebSocket}
         *!/
        _initWS() {
            if ("WebSocket" in window) {
                // Let us open a web socket
                let ws = new WebSocket(config.pushURL);

                ws.onopen = () => {
                    console.log("cnx");
                };

                ws.onmessage = (evt) => {
                    console.log("Message received");
                };
                ws.onclose = () => {
                    console.log("cnx closed");
                };
                ws.onerror = () => {
                    console.log("onerror");
                };
                return ws;
            } else {
                // The browser doesn't support WebSocket
                console.warn("WebSocket NOT supported by your Browser!");
                return null;
            }
        }*/

    /**
     * @param args {XHRArgs}
     * @private
     */
    _sendXHR(args) {
        let xhr = new XMLHttpRequest();
        let config = this.config;
        // : 'bearer ' + config.token
        xhr.open(args.method, args.url, true);
        let headers = args.headers || {};
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
        // Avoid the preflight request
        //xhr.setRequestHeader('Authorization', config.token);
        if (!headers['Content-type']) {
            xhr.setRequestHeader("Content-Type", "text/plain");
        }
        let data = args.data || null;
        // add token if missed
        if (!data.token) {
            data.token = config.token;
        }
        // add endpoint if missed
        let endpoint = args.endpoint || null;
        if (!data.endpoint) {
            data.endpoint = endpoint;
        }
        if (typeof (data) !== "string") {
            data = JSON.stringify(data);
        }
        // catch the callback
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                try {
                    let response = JSON.parse(xhr.responseText);
                    if (xhr.status === 200 && response.status === 'OK') {
                        args.onSuccess && args.onSuccess(response);
                    } else {
                        args.onError && args.onError(response);
                    }
                } catch (e) {
                    console.log(xhr.status)
                }
            }
        };
        xhr.send(data || null);
    }

    /**
     *
     * @param args
     */
    _sendRequest(args) {
        Logger.log(args);
        args = args || {};
        if (!args.method) {
            args.method = 'GET';
        }
        // check if is async mode
        if (args.sync) {
            this._sendXHR(args);
        } else {
            // do not block the app
            setTimeout(() => {
                this._sendXHR(args);
            })
        }
    }

    /**
     *
     * @param args
     * @returns {boolean}
     */
    push(args) {
        /*// WS not supported yet
        if (this.wsInstance) {
            let data = args.data;
            data.endpoint = endpoint;
            data = JSON.stringify(args.data);
            this.wsInstance.send(data);
            return true;
        }*/
        if (this.isOff) {
            return;
        }
        if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.origin.startsWith('https'))) {
            return console.warn('Unk only works when https is allowed');
        }
        args = args || {};
        args.method = 'POST';
        args.url = this.config.apiURL;
        if (this.debug) {
            return Logger.log(args);
        }
        this._sendRequest(args);
    }
}

/**
 *
 * @type {{getBrowserParams(): *, sendXHR(*=): void, _sendXHR(*): void, parse(String): (*|*|*), postXHR(*=): void, utm(*=): *}}
 */
const Utils = {
    /**
     * Parse the given query `str`.
     *
     * @param {String} str
     * @return {Object}
     * @api public
     */
    parse(str) {
        function decode(str) {
            try {
                return decodeURIComponent(str.replace(/\+/g, ' '));
            } catch (e) {
                return str;
            }
        }

        let pattern = /(\w+)\[(\d+)\]/;
        if ('string' != typeof str) return {};
        str = str.trim();
        if ('' === str) return {};
        if ('?' === str.charAt(0)) str = str.slice(1);

        let obj = {};
        let pairs = str.split('&');
        for (let i = 0; i < pairs.length; i++) {
            let parts = pairs[i].split('=');
            let key = decode(parts[0]);
            let m;
            if (m = pattern.exec(key)) {
                obj[m[1]] = obj[m[1]] || [];
                obj[m[1]][m[2]] = decode(parts[1]);
                continue;
            }

            obj[parts[0]] = null == parts[1]
                ? ''
                : decode(parts[1]);
        }
        return obj;
    },
    /**
     * Utm parsing
     * @param query
     */
    utm(query) {
        // Remove leading ? if present
        if (query.charAt(0) === '?') {
            query = query.substring(1);
        }
        query = query.replace(/\?/g, '&');
        let param;
        let params = Utils.parse(query);
        let results = {};
        for (let key in params) {
            if (Object.hasOwnProperty.call(params, key)) {
                if (key.substr(0, 4) === 'utm_') {
                    param = key.substr(4);
                    if (param === 'campaign') param = 'name';
                    results[param] = params[key];
                }
            }
        }
        return results;
    },
    /**
     * @returns {BrowserParams}
     *  The browser information
     */
    getBrowserParams() {
        return {
            // user agent
            ua: navigator.userAgent,
            // window width
            ww: window.innerWidth,
            // window height
            wh: window.innerHeight
        }
    },
    /**
     * Get array approximately the size of array
     */
    getArraySize(array) {
        return (JSON.stringify(array).replace(/[\[\]\,\"]/g, '')).length;
    },
};

export {Sender, Utils, Logger};
