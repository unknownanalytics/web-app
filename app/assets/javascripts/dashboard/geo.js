App.Routes['/dashboard/stats/geo'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_geo_scattering_template',
        mounted() {
            //
            this.updateGeoData({
                max: 400,
                entries: {
                    'TN': 200,
                    'IT': 100,
                    'FR': 12
                }
            });

        },
        data: function () {
            return {}
        },
        methods: {
            updateGeoData(data) {
                let className = 'circle-in-map';
                let svg = document.getElementById('map_world_svg');
                let countries = _.keys(data.entries);
                let circle, circles = [];
                _.each(countries, cId => {
                    let dom = svg.getElementById(cId);
                    if (dom) {
                        let b = dom.getBBox();
                        let cx = b.x + b.width / 2, cy = b.y + b.height / 2;
                        let r = '40';
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
                        console.log(cId);
                    }
                })
                // 'circle-in-map'
                setTimeout(() => {
                    _.each(svg.getElementsByClassName(className), c => {
                        c.setAttribute('stroke-dashoffset', 0);
                    })
                }, 0)
            }
        }

    })
};