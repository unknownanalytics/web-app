App.Routes['/dashboard/stats/pages'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_pages_views_template',
        mounted() {
            this.loadServerData({});
            this._attachActions();
        },
        data: function () {
            return {
                utms: ['x'],
                _serverData: null,
                stats: {
                    pages: 0,
                    pagesCount: 10,
                }
            }
        },
        methods: {
            _attachActions() {
            },
            loadServerData(options) {
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_DETAILS, {}, {success: this.updateData});
            },
            /**
             *
             * @param response
             */
            updateData(response) {
                this._serverData = response.data;
                this.draw(response.data, 'utm_source');
            },
            /**
             *
             * @param source
             * @param by
             */
            draw(source, by) {
                let views = source.views;
                // group by page_id
                let graph = _.groupBy(views, (e) => e[by]);
                let data = _.map(_.keys(graph), (key) => {
                    return _.reduce(graph[key], (memo, entry) => {
                        return memo + entry.count
                    }, 0)
                });

                // And for a doughnut chart
                var ctx = document.getElementById('canvas_views_stats').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: _.keys(graph),
                        datasets: [{
                            label: 'Nbr views ',
                            data: data,
                            borderColor: "#80b6f4",
                            pointBorderColor: "#80b6f4",
                            pointBackgroundColor: "#80b6f4",
                            pointHoverBackgroundColor: "#80b6f4",
                            pointHoverBorderColor: "#80b6f4",
                            pointBorderWidth: 10,
                            pointHoverRadius: 10,
                            pointHoverBorderWidth: 1,
                            pointRadius: 3,
                            fill: false,
                            borderWidth: 4
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                display: false
                            }],
                            xAxes: [{
                                display: false
                            }]
                        },
                    }
                });
            }

        }

    })
};

