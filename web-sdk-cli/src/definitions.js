/**
 * @typedef {Object} BrowserParams
 * @property {string} ua - User agent string
 * @property {number} ww - Window width
 * @property {number} wh - Window height
 */

/**
 * Define the event position in document
 * @typedef {Object} EventPosition
 * @property {string} ua - User agent string
 * @property {number} X - position of mouse in document.body.clientHeight
 * @property {number} wh - position of mouse in document.body.clientWidth
 */

/**
 * Define Ajax call data object
 * @typedef {Object} XHRArgs
 * @property {object} data - Data to be sent
 * @property {string} method - Method string POST|GET
 * @property {string} url - url
 * @property {function} onError - Error callback fn
 * @property {function} onSuccess - Success callback fn
 * @property {Array.<object.<string, string>>} headers - Custom headers, array of key,value strings
 */
