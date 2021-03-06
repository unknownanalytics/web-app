App.Routes['/dashboard'] = App.Routes['/'] = App.Routes[''] = function () {
    new Vue({
            el: document.getElementsByTagName('main')[0],
            template: '#app_dashboard_overview_template',
            mounted() {
                // Get domain
                let domainMeta = document.head.querySelector("[name~=app-domain][content]");
                if (domainMeta) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_OVERVIEW, {},
                        {
                            success:
                                (function (response) {
                                    this.stats = response.data.stats;
                                }).bind(this)
                        }
                    );
                    this.onChangePeriodTopPagesViews();
                    this.onChangePeriodDevicesViews();
                    this.onChangePeriodViews();
                    this.onChangePeriodLocationViews();

                } else {
                    this.stats = {
                        views: 'no data',
                        campaigns: 'no data',
                        referers: 'no data',
                        devices: 'no data'
                    };
                    this.$el.classList.add('no-data');
                }
            },
            data: function () {
                return {
                    stats: {
                        views: 0,
                        campaigns: 0,
                        referers: 0,
                        devices: 0
                    },
                    overview: {
                        devices: [],
                        heatmaps: [],
                        utms: [],
                    },
                    top_pages: {
                        data: []
                    },
                    geo: [],
                    views: {
                        selection: {
                            type: 'line',
                            color: 'black',
                            colors: Object.values(App.Helpers.PALETTE_COLORS)
                        },
                        chart: null
                    },
                    export_images: {
                        'world_img': null,
                        'views_img': null,
                        'devices_img': null,
                    }
                }
            },
            watch: {
                'views.selection.type': function () {
                    this.updatePagesViewStyle()
                },
                'export_images': function () {
                    this.generateImagesForExports();
                },
                'views': function () {
                    this.generateImagesForExports()
                }
            },
            methods: {
                _getSelectOption($event) {
                    let interval = ($event && $event.target) ? $event.target.value : 'year';
                    return {
                        interval: interval,
                        back: interval === 'day' ? 0 : 1,
                    }
                },
                /**
                 * Top Page views
                 * @param $event
                 */
                onChangePeriodTopPagesViews($event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_OVERVIEW_TOP_VIEWS,
                        Object.assign({
                            axe: 'all',
                        }, this._getSelectOption($event))
                        , {
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
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS_DEVICES,
                        Object.assign({
                            axe: 'devices',
                        }, this._getSelectOption($event)), {
                            success: (function (response) {
                                this.updateDevicesViews(response);
                                this.resetExportImages();
                            }).bind(this)
                        })
                },
                /**
                 * Devices view
                 * @param $event
                 */
                onChangePeriodViews($event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS, this._getSelectOption($event), {
                        success: (function (response) {
                            this.updatePagesViews(response.data.views);
                            this.resetExportImages();
                        }).bind(this)
                    })
                },
                /**
                 *
                 * @param $event
                 */
                onChangePeriodLocationViews($event) {
                    App.Api.get(App.API_ROUTES.DASHBOARD_STATS_GEO_DETAILS, this._getSelectOption($event), {
                        success: (function (response) {
                            this.geo = response.data.geo;
                        }).bind(this)
                    })
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
                    let TABLET = 'tablet';
                    let DESKTOP = 'desktop';
                    let MOBILE = 'mobile';
                    let UNKNOWN = 'unknown';

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
                                        unit: 'day',
                                        distribution: 'series',
                                        offset: true,
                                        time: {
                                            unit: 'day',
                                            unitStepSize: 1,
                                            displayFormats: {
                                                'day': 'MMM DD'
                                            },
                                        }/*,
                                        afterBuildTicks: function (scale, ticks) {
                                            var majorUnit = scale._majorUnit;
                                            if (!ticks) return;
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
                                        }*/
                                    }],
                                    yAxes: [{
                                        gridLines: {
                                            drawBorder: false
                                        },
                                        ticks: {
                                            // Include a dollar sign in the ticks
                                            precision: 0,
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Views count'
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
                                            label += parseInt(tooltipItem.value, 10);
                                            console.log(label);
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
                    } else {
                        this._getViewsChartDataSet().data = data;
                        this.views.chart.update();
                    }
                }

                ,
                /**
                 *
                 */
                updatePagesViewStyle() {
                    this._getViewsChartDataSet().type = this.views.selection.type;
                    this.views.chart.update();
                    this.resetExportImages();
                }
                ,
                /**
                 *
                 * @param color
                 */
                updatePagesViewColorStyle(color) {
                    let dataset = this._getViewsChartDataSet();
                    dataset.backgroundColor = Chart.helpers.color(color).alpha(0.5).rgbString();
                    this.views.selection.color = color;
                    dataset.borderColor = color;
                    this.views.chart.update();
                    this.resetExportImages();
                }
                ,
                /**
                 *
                 * @returns {{label, data, backgroundColor}|{label, backgroundColor, borderColor, data, type, pointRadius, fill, lineTension, borderWidth}|{label, data, backgroundColor, borderColor, borderWidth}|{label: string, data: number[], backgroundColor: any[]}|{label: string, backgroundColor: *, borderColor: string, data: *, type: string, pointRadius: number, fill: boolean, lineTension: number, borderWidth: number}|{label: string, data: *[], backgroundColor: string[], borderColor: string[], borderWidth: number}|*}
                 * @private
                 */
                _getViewsChartDataSet() {
                    let chart = this.views.chart;
                    return chart.config.data.datasets[0];
                }
                ,
                /**
                 *
                 */
                updateGeoStyle() {
                    this.resetExportImages();
                }
                ,
                resetExportImages() {
                    this.generateImagesForExports();
                }
                ,
                /**
                 *
                 */
                generateImagesForExports() {
                    App.Helpers.log("generate images")
                    setTimeout(() => {
                        // svg to canvas
                        App.Helpers.svgToImage("#map_world_svg", (err, res, ori) => {
                            this.export_images.world_img = res;
                        });
                        // canvas to image
                        let views_img = App.Helpers.canvasToImage('#canvas_views');
                        let devices_img = App.Helpers.canvasToImage('#canvas_devices');
                        // assign
                        this.export_images = Object.assign(this.export_images, {views_img, devices_img})
                    }, 1200)
                }
                ,
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

