App.Routes['/dashboard'] = App.Routes['/'] = App.Routes[''] = function () {
    new Vue({
            el: document.getElementsByTagName('main')[0],
            template: '#app_dashboard_overview_template',
            mounted() {
                //
                let domainMeta = document.head.querySelector("[name~=app-domain][content]");
                if (domainMeta) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_OVERVIEW, {},
                        {
                            success:
                                (function (response) {
                                    this.stats = response.data.stats;
                                    this.overview = response.data.overview;
                                }).bind(this)
                        }
                    );
                    //
                    this.onChangePeriodTopPagesViews();
                    this.onChangePeriodDevicesViews();
                    this.onChangePeriodViews();

                }
                else {
                    this.stats = {
                        viewsCount: 'no data',
                        sessionsCount: 'no data',
                        eventsCount: 'no data',
                        issuesCount: 'no data'
                    };
                    this.$el.classList.add('no-data');
                }
            },
            data: function () {
                return {
                    stats: {
                        viewsCount: 0,
                        sessionsCount: 0,
                        eventsCount: 0,
                        issuesCount: 0
                    },
                    overview: {
                        devices: [],
                        heatmaps: [],
                        utms: [],
                        geo: []
                    },
                    top_pages: {
                        data: []
                    },
                    views: {
                        selection: {
                            type: '#000',
                            color : 'black',
                            colors :Object.values(App.Helpers.PALETTE_COLORS)
                        },
                        chart: null
                    }
                }
            },
            watch: {
                'views.selection.type': function () {
                    this.updatePagesViewStyle()
                }
            },
            methods: {
                /**
                 * Top Page views
                 * @param event
                 */
                onChangePeriodTopPagesViews(event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_OVERVIEW_TOP_VIEWS, {
                        axe: 'all',
                        interval: (event && event.target) ? event.target.value : null
                    }, {
                        success: (function (response) {
                            this.updateTopPagesViews(response)
                        }).bind(this)
                    })
                },
                /**
                 * Devices view
                 * @param $event
                 */
                onChangePeriodDevicesViews($event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS_DEVICES, {
                        type: 'devices',
                        interval: ($event && $event.target) ? $event.target.value : null
                    }, {
                        success: (function (response) {
                            this.updateDevicesViews(response)
                        }).bind(this)
                    })
                },
                /**
                 * Devices view
                 * @param $event
                 */
                onChangePeriodViews($event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS, {
                        type: 'devices',
                        interval: ($event && $event.target) ? $event.target.value : null
                    }, {
                        success: (function (response) {
                            this.updatePagesViews(response.data.views)
                        }).bind(this)
                    })
                },
                onChangePeriodLocationViews($event) {

                },
                /**
                 * Update data on top page views
                 * @param response
                 */
                updateTopPagesViews(response) {
                    this.top_pages.data = _.sortBy(response.data.views, 'vcount').reverse();
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
                    this.DevicesViewsChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: keys.map(key => key + ' :' + Math.round((data[key] / data.total) * 100) + '%'),
                            datasets: [{
                                label: '# Devices',
                                data: keys.map(key => Math.round((data[key] / data.total) * 100)),
                                backgroundColor: Object.values(App.Helpers.PALETTE_COLORS),
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
                },
                updatePagesViews(data) {

                    function createChart(data) {
                        let ctx = document.getElementById('canvas_views').getContext('2d');
                        let colorHelper = Chart.helpers.color;
                        let color = App.Helpers.PALETTE_COLORS.black;

                        let cfg = {
                            data: {
                                datasets: [{
                                    label: 'All views',
                                    backgroundColor: colorHelper(color).alpha(0.5).rgbString(),
                                    borderColor: color,
                                    data: data,
                                    type: 'line',
                                    pointRadius: 0,
                                    fill: false,
                                    lineTension: 0,
                                    borderWidth: 2
                                }]
                            },
                            options: {
                                animation: {
                                    duration: 0
                                },
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        distribution: 'series',
                                        offset: true,
                                        ticks: {
                                            major: {
                                                enabled: true,
                                                fontStyle: 'bold'
                                            },
                                            source: 'data',
                                            autoSkip: true,
                                            autoSkipPadding: 75,
                                            maxRotation: 0,
                                            sampleSize: 100
                                        },
                                        afterBuildTicks: function (scale, ticks) {
                                            var majorUnit = scale._majorUnit;
                                            var firstTick = ticks[0];
                                            var i, ilen, val, tick, currMajor, lastMajor;
                                            val = moment(firstTick.value);
                                            if ((majorUnit === 'minute' && val.second() === 0)
                                                || (majorUnit === 'hour' && val.minute() === 0)
                                                || (majorUnit === 'day' && val.hour() === 9)
                                                || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
                                                || (majorUnit === 'year' && val.month() === 0)) {
                                                firstTick.major = true;
                                            } else {
                                                firstTick.major = false;
                                            }
                                            lastMajor = val.get(majorUnit);

                                            for (i = 1, ilen = ticks.length; i < ilen; i++) {
                                                tick = ticks[i];

                                                val = moment(tick.value);
                                                currMajor = val.get(majorUnit);
                                                tick.major = currMajor !== lastMajor;
                                                lastMajor = currMajor;
                                            }
                                            return ticks;
                                        }
                                    }],
                                    yAxes: [{
                                        gridLines: {
                                            drawBorder: false
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Views count($)'
                                        }
                                    }]
                                }, tooltips: {
                                    intersect: false,
                                    mode: 'index',
                                    callbacks: {
                                        label: function (tooltipItem, myData) {
                                            var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            label += parseFloat(tooltipItem.value).toFixed(2);
                                            return label;
                                        }
                                    }
                                }
                            }
                        };

                        return new Chart(ctx, cfg);
                    }

                    // format
                    data = data.map(e => {
                        return {
                            t: moment(e.t),
                            y: e.v,
                        }
                    });

                    if (!this.views.chart) {
                        this.views.chart = createChart(data);
                    }
                    else {
                        this._getDataSet().data = data;
                        this.views.chart.update();
                    }
                },
                updatePagesViewStyle() {
                    this._getDataSet().type = this.views.selection.type;
                    this.views.chart.update();
                },
                updatePagesViewColorStyle(color) {
                    let dataset = this._getDataSet();
                    dataset.backgroundColor = Chart.helpers.color(color).alpha(0.5).rgbString();
                    this.views.selection.color = color ;
                    dataset.borderColor = color;
                    this.views.chart.update();
                },
                _getDataSet() {
                    let chart = this.views.chart;
                    return chart.config.data.datasets[0];
                }
            }

        }
    )
};

function canvasEvents() {
    // And for a doughnut chart
    let canvas = document.getElementById('canvas_events');
    if (canvas) {
        var ctx = canvas.getContext('2d');


    }
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

