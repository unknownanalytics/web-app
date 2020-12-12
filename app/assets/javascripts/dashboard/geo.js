App.Routes['/dashboard/stats/geo'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_geo_vue_template',
        mounted() {
            this.init();
            this.updateData();
        },
        data: function () {
            return {
                stats: {
                    pages: 0,
                    pagesCount: 10,
                },
                startDate: null,
                endDate: null,
                data: []
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
             * @param start
             * @param date
             * @param filter
             */
            updateData(start, date, filter) {
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_GEO_DETAILS, {
                    from: this.startDate,
                    to: this.endDate,
                }, {
                    success: (response) => {
                        this.data = response.data.geo;
                    }
                });
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