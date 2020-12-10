App.Routes['/dashboard/stats/geo'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_geo_scattering_template',
        mounted() {
            this.init();
            this.updateData();
        },
        data: function () {
            return {
                showCircleLegend: true,
                range: 0,
                minValue: 0,
                stats: {
                    pages: 0,
                    pagesCount: 10,
                },
                startDate: null,
                endDate: null
            }
        },
        methods: {
            init() {
                this.svg = document.getElementById('map_world_svg');
                this.adjustSVGSize();
            },
            attachActions() {

            },
            /**
             * adjust the svg size
             */
            adjustSVGSize() {
                let vp = App.Helpers.getViewPort();
                let viewBox, width;
                if (vp.w > 1280) {
                    viewBox = '500 0 900 1000';
                    width = '100%';
                }
                else {
                    viewBox = '500 0 900 1150';
                    width = 900;
                    console.log('min')
                }
                this.svg.setAttribute('viewBox', viewBox);
                this.svg.setAttribute('width', width);

            },
            /**
             *
             * @param className
             */
            cleanOldCircles(className) {
                // clear old circle
                let old = document.getElementsByClassName(className);
                let attNode;
                for (let i = 0; i < old.length; i++) {
                    while (old[i].attributes.length > 0) {
                        attNode = old[i].attributes[0];
                        old[i].removeAttributeNode(attNode);
                    }
                }
            },
            /**
             *
             * @param response
             */
            render(response) {
                let info = response.data.info;
                console.log(info);
                let max = _.max(_.map(info, e => e.c));
                let min = _.min(_.map(info, e => e.c));
                let range = max - min;
                console.log('max ', max, 'min ', min, 'diff ', range);
                let className = 'circle-in-map';
                // remove old circles
                this.cleanOldCircles(className);
                let circlesLegend = {};
                this.minValue = min;
                this.range = range;
                //
                let svg = this.svg;
                let circle;
                _.each(info, info => {
                    let dom = svg.getElementById(info.iso);
                    if (dom) {
                        let b = dom.getBBox();
                        let cx = b.x + b.width / 2, cy = b.y + b.height / 2;
                        let r = 10 + ((info.c - min) / range) * 50;
                        circle = App.Charts.createSVGCircle({
                            r: r,
                            cx: cx,
                            cy: cy,
                            fill: 'red',
                            'stroke-width': 20,
                            stroke: 'gray',
                            'stroke-dasharray': '1000',
                            'stroke-dashoffset': '1000'
                        });
                        svg.appendChild(circle);
                        circle.classList.add(className);
                    }
                    else {
                        // console.log(cId);
                    }
                });
                // 'circle-in-map'
                setTimeout(() => {
                    _.each(svg.getElementsByClassName(className), c => {
                        c.setAttribute('stroke-dashoffset', 0);
                    })
                }, 0)
            },
            /**
             *
             * @param start
             * @param date
             * @param filter
             */
            updateData(start, date, filter) {
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_GEO_DETAILS, {
                    from: this.startDate,
                    to: this.endDate,
                }, {success: this.render});
            },
            onChangeStartDate(event) {
                this.startDate = event && event.target.value;
            },
            onChangeEndDate(event) {
                this.endDate = event && event.target.value;
            }
        }
    })
};