import {Utils, Sender} from '../utils';

const MOUSE_MOVE_EVENT = 'mousemove';
const MOUSE_OVER_EVENT = 'mouseover';
const CLICK_EVENT = 'click';
const END_POINT = 'event';

/**
 *
 */
class PerformanceManger {
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
        this._configureEvents();
    }

    /**
     *
     * @private
     */
    _configureEvents() {
        this._configureEvent(MOUSE_MOVE_EVENT,);
        this._configureEvent(CLICK_EVENT);
        this._configureEvent(MOUSE_OVER_EVENT);
    }

    /**
     *
     * @private
     */
    _configureEvent(eventType, options) {
        /**
         *
         * @type {boolean}
         */
        this.activateMouseMove = false;
        // Listen to mousemove
        window.addEventListener(eventType, function (event) {
            if (eventType !== MOUSE_MOVE_EVENT) {
                this.handleEvent(eventType, Utils.getBrowserParams(), event);
            }
            // M
            else {
                if (this.activateMouseMove) {
                    this.handleEvent(eventType, Utils.getBrowserParams(), event);
                }
            }
        }.bind(this));
        // do not block the app
        if (eventType === MOUSE_MOVE_EVENT)
            setInterval(function () {
                this.activateMouseMove = !this.activateMouseMove;
            }.bind(this), 100);
    }

    /**
     *
     * @param eventType
     * @param params {BrowserParams}
     * @param event
     */
    handleEvent(eventType, params, event) {
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
            eventType: eventType
        });
        console.log(eventType, px, py)

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

export default EventManager;
