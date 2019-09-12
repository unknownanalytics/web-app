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
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            }

        }

    })
};

