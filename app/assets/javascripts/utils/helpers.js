App.Helpers = {
    PALETTE_COLORS: [
        "#46BFBD",
        "#FDB45C",
        "#4699fd",
        "#ff6f5e",
        "#f5f0e3",
        "#ffbe88",
        "#ffa4bc",
        "#48B3FF",
        "#ebfa55",
        "#F7464A",
        "#eec3c3"
    ],
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

    }


};