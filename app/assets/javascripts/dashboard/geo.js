App.Routes['/dashboard/stats/geo'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_geo_vue_template',
        mounted() {
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