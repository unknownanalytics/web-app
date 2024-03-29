App.Routes['/dashboard/stats/pages'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_pages_views_template',
        mounted() {
            this.reloadAll();
        },
        data() {
            return {
                data: {
                    browsers: [],
                    utms: [],
                    origins: [],
                    pages: []
                },

                weekDay: {
                    startRange: moment().startOf('isoWeek').format('YYYY-MM-DD')
                },
                viewsSettings: {
                    page: null,
                    utm: null,
                    browser: null,
                    origin: null,
                }
            }
        },
        methods: {
            _getDefaultFilterParams() {
                let page = this.viewsSettings.page;
                return page ? {page_id: page.id} : {};
            },
            /**
             *
             */
            clearCurrentPage() {
                this.viewsSettings.page = null;
                this.reloadAll();
            },
            /**
             *
             * @param page
             */
            onSelectedPage(page) {
                this.viewsSettings.page = page;
                this.reloadAll();
            },
            /**
             *
             */
            reloadAll() {
                this.loadSummaryData({});
                this.onChangePageViewsFilter();
                this.onChangeWeekDayFilter();
            },
            /**
             *
             * @param options
             */
            loadSummaryData(options) {
                let params = this._getDefaultFilterParams();
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_SUMMARY, params, {success: this.onLoadSummary});
            },
            /**
             *
             * @param $event
             */
            onChangePageViewsFilter($event) {
                let params = this._getDefaultFilterParams();
                let settings = this.viewsSettings;
                if (settings.browser) {
                    params.browser = settings.browser;
                }
                if (settings.utm) {
                    params.utm = settings.utm;
                }
                if (settings.origin) {
                    params.origin = settings.origin;
                }
                console.log(this.viewsSettings);
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS, params, {success: this.drawViewsLine});
            },
            /**
             *
             * @param $event
             */
            onChangeWeekDayFilter($event) {
                let params = this._getDefaultFilterParams();
                params = Object.assign({}, params, {
                    start: this.weekDay.startRange
                });
                App.Api.get(App.API_ROUTES.DASHBOARD_STATS_PAGES_VIEWS_WEEKLY_BY_DAYS, params, {success: this.drawViewDaily});
            },
            /**
             *
             * @param response
             */
            drawViewsLine(response) {
                let viewsByDay = _.groupBy(response.data.views, 't');
                let end = new Date();
                let start = new Date();
                start.setFullYear(end.getFullYear() - 1);
                let range = App.Helpers.getRangeDate(start, end, '-');
                data = [];
                range.forEach(day => {
                    data.push([day, viewsByDay[day] ? viewsByDay[day][0].v : 0]);
                });
                /* ["2015-02-03", 143], ["2015-02-05", 62], ["2015-02-06", 100], ["2015-02-09", 152], ["2015-02-10", 166], ["2015-02-11", 55], ["2015-02-12", 59], ["2015-02-13", 175], ["2015-02-14", 293], ["2015-02-15", 326], ["2015-02-16", 153], ["2015-02-18", 73], ["2015-02-19", 267], ["2015-02-20", 183], ["2015-02-21", 394], ["2015-02-22", 158], ["2015-02-23", 86], ["2015-02-24", 207]];*/
                // based on prepared DOM, initialize echarts instance
                let myChart = echarts.init(document.getElementById('main_chart'));
                let indexStartForRange = 0;
                let palette = App.Helpers.PALETTE_COLORS;
                let pieces = Object.keys(palette).map(key => {
                    return {
                        gt: indexStartForRange * 50,
                        // increment
                        lte: (indexStartForRange++ + 1) * 50,
                        color: palette[key]
                    }
                });
                let option = {
                    title: {
                        text: 'views'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        data: data.map(function (item) {
                            return item[0];
                        })
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    toolbox: {
                        left: 'center',
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none',
                                show: false
                            },
                            restore: {
                                title: 'Restore'
                            },
                            saveAsImage: {
                                title: 'Download image'
                            }
                        }
                    },
                    dataZoom: [{
                        startValue: App.Helpers.formatDate(start, '-')
                    }, {
                        type: 'inside'
                    }],
                    visualMap: {
                        top: 10,
                        right: 10,
                        pieces: pieces,
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: {
                        name: 'Page views',
                        type: 'line',
                        data: data.map(function (item) {
                            return item[1];
                        }),
                        markLine: {
                            silent: true,
                            data: pieces.map(e => {
                                return {yAxis: e.lte}
                            })
                        }
                    }
                };

                myChart.setOption(option);

            },
            drawViewDaily(response) {
                //app.title = '单轴散点图';
                let data = response.data.views;
                var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
                    '7a', '8a', '9a', '10a', '11a',
                    '12p', '1p', '2p', '3p', '4p', '5p',
                    '6p', '7p', '8p', '9p', '10p', '11p'];
                // MONDAY, Tuesday , wed, thur ... sunday
                var days = ['Sunday', 'Saturday', 'Friday', 'Thursday',
                    'Wednesday', 'Tuesday', 'Monday'].reverse();

                data = App.Helpers.formatAsDailyHours(data);

                var myChart = echarts.init(document.getElementById('main_week_chart'));

                var option = {
                    tooltip: {
                        position: 'top'
                    },
                    toolbox: {
                        left: 'center',
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none',
                                show: false
                            },
                            restore: {
                                show: false,
                            },
                            saveAsImage: {
                                title: 'Download image'
                            }
                        }
                    },
                    title: [],
                    singleAxis: [],
                    series: []
                };

                echarts.util.each(days, function (day, idx) {
                    option.title.push({
                        textBaseline: 'middle',
                        top: (idx + 0.5) * 100 / 7 + '%',
                        text: day
                    });
                    option.singleAxis.push({
                        left: 150,
                        type: 'category',
                        boundaryGap: false,
                        data: hours,
                        top: (idx * 100 / 7 + 5) + '%',
                        height: (100 / 7 - 10) + '%',
                        axisLabel: {
                            interval: 2
                        }
                    });
                    option.series.push({
                        singleAxisIndex: idx,
                        coordinateSystem: 'singleAxis',
                        type: 'scatter',
                        data: [],
                        symbolSize: function (dataItem) {
                            //console.log(Math.min(100, dataItem[1]));
                            return Math.min(100, dataItem[1]);
                        }
                    });
                });

                echarts.util.each(data, function (dataItem) {
                    option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
                });
                myChart.setOption(option);
            },
            /**
             *
             * @param response
             */
            onLoadSummary(response) {
                let data = response.data;
                let myChart = echarts.init(document.getElementById('canvas_pages_partition'));
                let dataOrigins = data.origins.map(e => {
                    return {
                        name: App.Helpers.formatOrigin(e.origin),
                        value: e.count
                    }
                });


                let dataBrowsers = data.browsers.map(e => {
                    return {
                        name: e.browser || "?",
                        value: e.count
                    }
                });


                let dataUtms = data.utms.map(e => {
                    return {
                        name: e.utm_campaign || "?",
                        value: e.count
                    }
                });

                let option = {
                    title: [{
                        text: ''
                    }, {
                        subtext: 'Origins',
                        left: '16.67%',
                        top: '75%',
                        textAlign: 'center'
                    }, {
                        subtext: 'Browsers',
                        left: '50%',
                        top: '75%',
                        textAlign: 'center'
                    }, {
                        subtext: 'Utms',
                        left: '83.33%',
                        top: '75%',
                        textAlign: 'center'
                    }],
                    series: [{
                        type: 'pie',
                        radius: '40%',
                        center: ['50%', '50%'],
                        data: dataOrigins,
                        animation: false,
                        label: {
                            position: 'outer',
                            alignTo: 'none',
                            bleedMargin: 5
                        },
                        left: 0,
                        right: '66.6667%',
                        top: 0,
                        bottom: 0
                    }, {
                        type: 'pie',
                        radius: '40%',
                        center: ['50%', '50%'],
                        data: dataBrowsers,
                        animation: false,
                        label: {
                            position: 'outer',
                            alignTo: 'labelLine',
                            bleedMargin: 5
                        },
                        left: '33.3333%',
                        right: '33.3333%',
                        top: 0,
                        bottom: 0
                    }, {
                        type: 'pie',
                        radius: '40%',
                        center: ['50%', '50%'],
                        data: dataUtms,
                        animation: false,
                        label: {
                            position: 'outer',
                            alignTo: 'edge',
                            margin: 20
                        },
                        left: '66.6667%',
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                };
                myChart.setOption(option);

                this.data = response.data;
            },

        }

    })
};

