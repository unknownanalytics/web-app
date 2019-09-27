App.Routes['/dashboard'] = App.Routes['/'] = App.Routes[''] = function () {
    new Vue({
            el: document.getElementsByTagName('main')[0],
            template: '#app_dashboard_overview_template',
            mounted() {
                canvasEvents();
                App.Api.get(App.API_ROUTES.DASHBOARD_OVERVIEW, {},
                    {
                        success:
                            (function (response) {
                                this.stats = response.data;
                            }).bind(this)
                    }
                );
                mapView({
                    max: 400,
                    entries: {
                        'TN': 200,
                        'IT': 100,
                        'FR': 12
                    }
                });
                //
                this.onChangePeriodTopPagesViews();
                this.onChangePeriodDevicesViews();
            },
            data: function () {
                return {
                    stats: {
                        viewsCount: 0,
                        sessionsCount: 0,
                        eventsCount: 0,
                        issuesCount: 0
                    }
                }
            },
            methods: {
                /**
                 * Top Page views
                 * @param event
                 */
                onChangePeriodTopPagesViews(event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES, {interval: (event && event.target) ? event.target.value : null}, {
                        success: (function (response) {
                            this.updateTopPagesViews(response)
                        }).bind(this)
                    })
                },
                /**
                 * Devices view
                 * @param event
                 */
                onChangePeriodDevicesViews(event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS_DEVICES, {
                        type: 'devices',
                        interval: (event && event.target) ? event.target.value : null
                    }, {
                        success: (function (response) {
                            this.updateDevicesViews(response)
                        }).bind(this)
                    })
                },
                /**
                 * Update data on top page views
                 * @param response
                 */
                updateTopPagesViews(response) {
                    var data = response.data;
                    // And for a doughnut chart
                    var ctx = document.getElementById('canvas_views').getContext('2d');
                    data = data.page_views;
                    let sortedKeys = _.sortBy(data, 'vcount');
                    // clear it if exists
                    if (this.topPageViewsChart) {
                        this.topPageViewsChart.destroy();
                    }
                    this.topPageViewsChart = new Chart(ctx, {
                        type: 'horizontalBar',
                        data: {
                            labels: data.map(e => e.full_url),
                            datasets: [{
                                label: '# top Pages',
                                data: data.map(e => e.vcount),
                                backgroundColor: ['#ff7007', '#ffa4bc', '#ffbe88', '#0D2B3E', '#cccccc'],
                                borderColor: [
                                    '#ff7007', '#ffa4bc', '#ffbe88', '#0D2B3E', '#cccccc'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {mirror: true}
                                }]
                            }
                        }
                    });
                },
                /**
                 * Update data on devices partition chart
                 * @param response
                 */
                updateDevicesViews(response) {
                    var TABLET = 'tablet';
                    var DESKTOP = 'desktop';
                    var MOBILE = 'mobile';
                    var UNKNOWN = 'unknown';

                    let data = response.data;
                    data = data.page_views[0];
                    const keys = [TABLET, DESKTOP, MOBILE, UNKNOWN];
                    var ctx = document.getElementById('canvas_devices').getContext('2d');
                    // clear it if exists
                    if (this.DevicesViewsChart) {
                        this.DevicesViewsChart.destroy();
                    }
                    console.log(keys.map(key => (data[key] / data.total) * 100));
                    this.DevicesViewsChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: keys.map(key => key + ' :' + Math.round((data[key] / data.total) * 100) + '%'),
                            datasets: [{
                                label: '# Devices',
                                data: keys.map(key => Math.round((data[key] / data.total) * 100)),
                                backgroundColor: [
                                    '#ff7007',
                                    '#ffa4bc',
                                    '#ffbe88',
                                    'gray'
                                ],
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

        }
    )
}

function canvasEvents() {
    // And for a doughnut chart
    let canvas = document.getElementById('canvas_events');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bubble',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: 'Events',
                    data: [
                        {
                            x: 2,
                            y: 12,
                            r: 3
                        }, {
                            x: 12,
                            y: 5,
                            r: 8
                        }, {
                            x: 12,
                            y: 12,
                            r: 15
                        }, {
                            x: 3,
                            y: 12,
                            r: 3
                        }, {
                            x: 3,
                            y: 19,
                            r: 3
                        }, {
                            x: 29,
                            y: 19,
                            r: 3
                        }],
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)'
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


/**
 * Map
 */
function mapView(data) {
    // And for a doughnut chart
    if (data) {
        var max = data.max;
        var entries = data.entries;
        var countries = App.Helpers.getSVGCountriesCodes();
        var gradientColors = 'blue,cyan,green,yellow,red'.split(',');
        var dom;
        countries.forEach(function (code) {
            dom = document.querySelector('#' + code);
            if (dom) {
                dom.style.fill = entries[code] ? App.Charts.getGradient(entries[code] / max, gradientColors) : 'gray';
                if (entries[code]) {
                    console.log(App.Charts.getGradient(entries[code] / max, gradientColors));
                }
            }
        })
    }
}
