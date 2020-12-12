(function () {
    // Define a new component called button-counter
    Vue.component('app-v-choropleth-chart', {
        template: '#app_component_map_chloropleth_template',
        props: ['data', 'showCircleLegend'],
        data() {
            return {
                range: 0,
                minValue: 0,
            }
        },
        mounted() {
        },
        watch: {
            // listen to changes
            data: function f() {
                this.render();
                this.drawCircles();

            }
        },
        computed: {},

        methods: {
            setIndicators() {

            },
            render() {
                let map = this.$el;
                // check if
                let data = this.data;
                // get max code
                let max = _.max(_.map(data, e => e.val));
                let countByCountries = _.groupBy(data, 'iso');
                let countries = App.Helpers.getSVGCountriesCodes();
                let gradientColors = JSON.parse(map.dataset['gradientColor']);
                let countrySvgShape;
                countries.forEach(function (code) {
                    countrySvgShape = map.querySelector('#' + code);
                    if (countrySvgShape) {
                        let val = countByCountries[code] && countByCountries[code][0].val;
                        if (val) {
                            countrySvgShape.style.fill = val ? App.Charts.getGradient(val / max, gradientColors) : 'white';
                            countrySvgShape.$ukC = val;
                            countrySvgShape.addEventListener('mouseover', ((event) => {
                                console.log(event.currentTarget.$ukC)
                            }));
                        }
                    }
                })
            },
            /**
             *
             * @param className
             */
            cleanOldCircles(className) {
                // clear old circle
                let old = document.getElementsByClassName(className);
                let attNode;
                for (let i = 0; i < old.length; i++) {
                    while (old[i].attributes.length > 0) {
                        attNode = old[i].attributes[0];
                        old[i].removeAttributeNode(attNode);
                    }
                }
            },
            /**
             *
             * @param response
             */
            drawCircles() {
                let info = this.data;
                let max = _.max(_.map(info, e => e.val));
                let min = _.min(_.map(info, e => e.val));
                let range = max - min;
                console.log('max ', max, 'min ', min, 'diff ', range);
                let className = 'circle-in-map';
                // remove old circles
                this.cleanOldCircles(className);
                this.minValue = min;
                this.range = range;
                //
                let svg = this.$el.querySelector('svg');
                let circle;
                _.each(info, el => {
                    let dom = svg.getElementById(el.iso);
                    if (dom) {
                        let b = dom.getBBox();
                        let cx = b.x + b.width / 2, cy = b.y + b.height / 2;
                        let r = 10 + ((el.val - min) / range) * 50;
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
                        // console.log(cId);
                    }
                });
                // 'circle-in-map'
                setTimeout(() => {
                    _.each(svg.getElementsByClassName(className), c => {
                        c.setAttribute('stroke-dashoffset', 0);
                    })
                }, 0)
            }

        },
    });
})();