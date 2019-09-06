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
            onChangePeriodTopPagesViews(event) {
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES, {interval: (event && event.target) ? event.target.value : null}, {
                    success: (function (response) {
                        updateTopPagesViews(response)
                    }).bind(this)
                })
            },
            onChangePeriodDevicesViews(event) {
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS_DEVICES, {
                    type: 'devices',
                    interval: (event && event.target) ? event.target.value : null
                }, {
                    success: (function (response) {
                        updateTopDevicesViews(response)
                    }).bind(this)
                })
            }
        }

    })
};

function updateTopPagesViews(response) {
    var data = response.data;
    // And for a doughnut chart
    var ctx = document.getElementById('canvas_views').getContext('2d');
    data = data.page_views;
    let sortedKeys = _.sortBy(data, 'vcount');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: data.map(e => e.full_url),
            datasets: [{
                label: '# top Pages',
                data: data.map(e => e.vcount),
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
                    ticks: {mirror: true}
                }]
            }
        }
    });
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

function updateTopDevicesViews(response) {
    var TABLET = 'tablet';
    var DESKTOP = 'desktop';
    var MOBILE = 'mobile';
    var UNKNOWN = 'unknown';
    let data = response.data;
    const totalViews = data.page_views.length;
    const keys = [TABLET, DESKTOP, MOBILE, UNKNOWN];
    // And for a doughnut chart
    data = _.groupBy(data.page_views, function (o) {
        if (o.is_desktop) {
            return DESKTOP
        }
        if (o.is_mobile) {
            return MOBILE
        }
        if (o.is_tablet) {
            return TABLET
        }
        return UNKNOWN
    });
    var ctx = document.getElementById('canvas_devices').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: keys,
            datasets: [{
                label: '# Devices',
                data: keys.map(key => Math.round(((data[key] ? data[key].length : 0) / totalViews) * 100 * 10) / 10),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
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
