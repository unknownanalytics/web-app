import {Utils} from "../utils";

const VIEW = 'view';

/**
 *
 */
class PageViewManager {
	/*
	sender: Sender = null;
	options: null;
	*/


	/**
	 *
	 * @param options
	 * @param sender
	 */
	constructor(options, sender) {
		this.options = options;
		this.sender = sender;
		let eventType = 'pushState';
		(function (history) {
			var pushState = history.pushState;
			history.pushState = function (state) {
				if (typeof history.onpushstate == "function") {
					history.onpushstate({state: state});
				}
				var event = new Event(eventType);
				event.arguments = arguments;
				window.dispatchEvent(event);
				// ... whatever else you want to do
				// maybe call onhashchange e.handler
				return pushState.apply(history, arguments);
			};
		})(window.history);

		// Now we can listen for pushState events and keep the original feature of the browser working
		window.addEventListener(eventType, this.handleUrl.bind(this));

		// init first call
		this.fireFirstEvent();
	}

	/**
	 *
	 */
	fireFirstEvent() {
		this.handleUrl();
	}

	/**
	 *
	 */
	handleUrl(event) {
		let location = document.location;
		let href = location.href;
		if (!(location.hostname === 'localhost' || location.origin.startsWith('https'))) {
			return console.error('only https is allowed');
		}
		let data = Object.assign({}, {full_url: href}, {utm: Utils.utm(href)});
		this.push(data);
	}

	/**
	 *
	 */
	push(body) {
		body = Object.assign({}, body, {browser: Utils.getBrowserParams()});
		this.sender.push({data: body, type: VIEW})
	}
}

export default PageViewManager;
