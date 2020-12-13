App.Helpers = {
    int(val) {
        return parseInt(val, 10)
    },
    PALETTE_COLORS: {
        green: "#46BFBD",
        blue: "#4699fd",
        redlight: "#ff6f5e",
        pinklight: "#726aff",
        gray: "#ff3a1a",
        orangelight: "#ffbe88",
        orange: "#FDB45C",
        bluelight: "#48B3FF",
        yelow: "#ebfa55",
        red: "#F7464A",
        violetlight: "#eec3c3",
        black: "#000"
    },
    /**
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
            let day = App.Helpers.int(dayAndHour.split('-')[1]);
            let hour = App.Helpers.int(dayAndHour.split('-')[0]);
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
        return [[0, 0, 5],
            [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0],

            [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1],
            [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3],
            [0, 22, 2], [0, 23, 5],


            [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0],
            [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11],
            [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1],
            [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3],
            [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5],
            [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3],
            [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1],
            [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13],
            [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6],
            [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0],
            [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2],
            [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12],
            [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0],
            [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0],
            [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7],
            [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];


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
                dates.push(App.Helpers.formatDate(currentDate, sep));
                currentDate = addDays.call(currentDate, 1);
            }
            return dates;
        };
        // Usage
        return buildArray(startDate, endDate);

    },
    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    /**
     *
     * @param link
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
    }

};