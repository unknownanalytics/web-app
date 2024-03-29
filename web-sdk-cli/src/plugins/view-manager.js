import {Logger, Utils, Sender} from "../utils";

const VIEW = 'view';

/**
 *
 */
class PageViewManager {
    /*
    sender: Sender = null;
    options: null;
    */
    // instance singleton
    static manager = null;

    /**
     *
     * @param options
     * @param sender
     */
    /**
     *
     * @param options
     * @param sender
     */
    constructor(options, sender) {
        Logger.log('######## constructor ##############"');
        this.options = options;
        this.sender = sender;
        this.lastLocation = null;
        // override default function and add custom event change
        var eventName = 'unkChange';
        window.addEventListener(eventName, this.onPopChange.bind(this));
        /* override pushState */
        history.pushState = (f => function pushState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event(eventName));
            return ret;
        })(history.pushState);
        /* override replaceState */
        history.replaceState = (f => function replaceState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event(eventName));
            return ret;
        })(history.replaceState);
        /* Add event listener */
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event(eventName))
        })
        // init first call
        this.onPopChange();
    }

    /**
     *
     */
    onPopChange(event) {
        Logger.log('######## onPopChange event##############"');
        let location = document.location;
        if (this.lastLocation !== location.href) {
            let href = location.href;
            if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.origin.startsWith('https'))) {
                return console.error('only https is allowed');
            }
            let data = Object.assign({}, {url: href}, {utm: Utils.utm(href)});
            this.push(data);
        }
        this.lastLocation = location.href;
    }

    static createManager(options, sender) {
        if (!PageViewManager.manager) {
            PageViewManager.manager = new PageViewManager(options, sender);
        }
        return PageViewManager.manager;
    }

    /**
     *
     */
    push(body) {
        body = Object.assign({}, body, {browser: Utils.getBrowserParams()});
        this.sender.push({data: body, endpoint: VIEW})
    }
}

export default PageViewManager;
