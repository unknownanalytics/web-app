const Helpers = {
    int(val) {
        return parseInt(val, 10)
    },
    PALETTE_COLORS: {
        green: "#46BFBD",
        blue: "#4699fd",
        redlight: "#ff6f5e",
        pinklight: "#726aff",
        gray: "#ff3a1a",
        orange: "#FDB45C",
        bluelight: "#48B3FF",
        yelow: "#ebfa55",
        red: "#F7464A",
        violetlight: "#eec3c3",
        black: "#000"
    },
    /**
     * @deprecated find id from inside svg
     * please see map_svg to see all ids
     */
    getSVGCountriesCodes() {
        return "AF,AL,DZ,AS,AD,AO,AI,AQ,AG,AR,AM,AW,AU,AT,AZ,BS,BH,BD,BB,BY,BE,BZ,BJ,BM,BT,BO,BQ,BA,BW,BV,BR,IO,BN,BG,BF,BI,CV,KH,CM,CA,KY,CF,TD,CL,CN,CX,CC,CO,KM,CD,CG,CK,CR,HR,CU,CW,CY,CZ,CI,DK,DJ,DM,DO,EC,EG,SV,GQ,ER,EE,SZ,ET,FK,FO,FJ,FI,FR,GF,PF,TF,GA,GM,GE,DE,GH,GI,GR,GL,GD,GP,GU,GT,GG,GN,GW,GY,HT,HM,VA,HN,HK,HU,IS,IN,ID,IR,IQ,IE,IM,IL,IT,JM,JP,JE,JO,KZ,KE,KI,KP,KR,KW,KG,LA,LV,LB,LS,LR,LY,LI,LT,LU,MO,MG,MW,MY,MV,ML,MT,MH,MQ,MR,MU,YT,MX,FM,MD,MC,MN,ME,MS,MA,MZ,MM,NA,NR,NP,NL,NC,NZ,NI,NE,NG,NU,NF,MP,NO,OM,PK,PW,PS,PA,PG,PY,PE,PH,PN,PL,PT,PR,QA,MK,RO,RU,RW,RE,BL,SH,KN,LC,MF,PM,VC,WS,SM,ST,SA,SN,RS,SC,SL,SG,SX,SK,SI,SB,SO,ZA,GS,SS,ES,LK,SD,SR,SJ,SE,CH,SY,TW,TJ,TZ,TH,TL,TG,TK,TO,TT,TN,TR,TM,TC,TV,UG,UA,AE,GB,UM,US,UY,UZ,VU,VE,VN,VG,VI,WF,EH,YE,ZM,ZW,AX".split(',')
    },
    /**
     *
     * @param id
     * @returns {Node}
     */
    getDashboardMainContainer(id) {
        return id ? document.getElementById(id) : document.getElementsByTagName('main')[0];
    },
    /**
     *  https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
     */
    getViewPort() {
        let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return {w: w, h: h}
    },
    /**
     * serialize an object as query
     * @param obj
     * @param prefix
     * @returns {string}
     */
    serializeObject(obj, prefix) {
        var str = [],
            p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    },
    /**
     * Format Date , given a javascript date object, it will convert it
     * to yyyy(sep)mm(sep)dd, if sep = "-"
     * yyyy-mm-dd
     * @param d
     * @param sep
     * @returns {string}
     */
    formatDate(d, sep) {
        // convert single caractere value to 2 caracter length
        // 1 => '01'
        // 8 => '08'
        // used to format data
        let checkLength = function (v) {
            return ('' + v).length < 2 ? '0' + v : v;
        };
        let date = d.getDate();
        let month = d.getMonth() + 1; //Months are zero based
        let year = d.getFullYear();
        return [year, checkLength(month), checkLength(date)].join(sep);
    },
    /**
     * sep => separator
     */
    formatAsDailyHours(data) {
        // "YYYY-MM-DD HH24-ID"
        let dayAndHour;
        let dictDaysAndHours = {};

        data.forEach(e => {
            dayAndHour = e.t.split(' ')[1];
            let day = Helpers.int(dayAndHour.split('-')[1]);
            let hour = Helpers.int(dayAndHour.split('-')[0]);
            if (!dictDaysAndHours[day]) {
                dictDaysAndHours[day] = {}
            }
            dictDaysAndHours[day][hour] = e.v;
        });

        let result = [], day, val;

        for (let i = 0; i < 7; i++) {
            day = [];
            for (let j = 0; j < 24; j++) {
                val = dictDaysAndHours[i] ? (dictDaysAndHours[i][j] ? dictDaysAndHours[i][j] : 0) : 0;
                result.push([i, j, val])
            }
        }
        return result;
        /* [[d, t, value],
            [0, 1, 1], .....
            [1, 0, 7] .... ];*/


    },
    /**
     * sep => separator
     */
    getRangeDate(startDate, endDate, sep) {

        // Returns an array of dates between the two dates
        let buildArray = function (startDate, endDate) {
            let dates = [],
                currentDate = startDate,
                addDays = function (days) {
                    let date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
            while (currentDate <= endDate) {
                dates.push(Helpers.formatDate(currentDate, sep));
                currentDate = addDays.call(currentDate, 1);
            }
            return dates;
        };
        // Usage
        return buildArray(startDate, endDate);

    },
    /**
     *
     * @param link {Element }
     */
    disableLink(link) {
        if (link && link.parentElement) {
            // 1. Add isDisabled class to parent span
            link.parentElement.classList.add('is-disabled');
            // 2. Store href so we can add it later
            link.setAttribute('data-href', link.href);
            // 3. Remove href
            link.href = '';
            // 4. Set aria-disabled to 'true'
            link.setAttribute('aria-disabled', 'true');
        }
    },

    /**
     * @param el {Element | string}
     */
    canvasToImage(el) {
        let canvas = Helpers.getElement(el)
        if (canvas) {
            return canvas.toDataURL();
        }
        return null;

    },

    /**
     * @param el {Element | string}
     * @param cb {Function}
     */
    svgToImage(el, cb) {
        let svgElement = Helpers.getElement(el);
        if (svgElement) {
            let canvas = Helpers.createElement('canvas');
            //let bgasUrl = Helpers.serializeSVG(svgElement);
            const image = new Image();
            //console.log(el);
            image.src = App.Helpers.getSvgBackgroundUrl(el);
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                // Draw the image
                ctx.drawImage(image, 0, 0);
                let result = canvas.toDataURL();
                //document.removeChild(canvas);
                cb(null, result, image.src)
            }
        }
        else {
            cb("empty el");
        }

    },
    /**
     *
     * @param el
     * @returns {string}
     */
    getSvgBackgroundUrl(el) {
        let svgElement = Helpers.getElement(el);
        if (svgElement) {
            svgElement.setAttribute('width', svgElement.clientWidth);
            return "data:image/svg+xml;utf8," + svgElement.outerHTML;
        }

    },
    /**
     *
     * @param el  {Element | string }
     * @returns {Element}
     */
    getElement(el) {
        return el && typeof (el) === "string" ? document.querySelector(el) : el;
    },
    /**
     *
     * @param tag string
     * @param attrs {Object | null}
     * @returns {Element}
     */
    createElement(tag, attrs) {
        let dom = document.createElement(tag);
        _.each(attrs, (prop, value) => {
            dom.setAttribute(prop, value);
        });
        return dom;
    },
    /**
     *
     * @param el  {Element | string }
     * @param options
     * @returns {string}
     */
    serializeSVG(el, options) {
        options = options || {};
        //get svg element.
        let svg = Helpers.getElement(el);
        if (svg) {
            //get svg source.
            let serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);

            //add name spaces.
            if (!source.match(/^<svg[^>]+xmlns="http\/\/www\.w3\.org\/2000\/svg"/)) {
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if (!source.match(/^<svg[^>]+"http\/\/www\.w3\.org\/1999\/xlink"/)) {
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            return options.encodeUri ? encodeURIComponent(source) : source;
        }
    },
    /**
     *
     * @param el
     * @returns {string}
     */
    serializeSVGAsBase64(el) {
        return window.btoa(this.serializeSVG(el));
    }

};
App.Helpers = Helpers;