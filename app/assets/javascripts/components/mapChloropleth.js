(function () {
    const CHOROPLETH = 'choropleth';
    const BUBBLE = 'bubble';
    const BUBBLE_CLASS = 'circle-in-map';
    const BUBBLE_LEGEND_ID = 'bubble_legend';
    const BUBBLE_DEFAULT_RADIUS = 50;
    // Define a new component called button-counter
    Vue.component('app-v-choropleth-chart', {
        template: '#app_component_map_choropleth_template',
        props: ['data'],
        data() {
            return {
                range: 0,
                minValue: 0,
                renderStyle: BUBBLE,
                legendTranslateX: 0,
                defaultRadius: BUBBLE_DEFAULT_RADIUS
            }
        },
        mounted() {
            this.adjustDesktopSVGSize();
            this.adjustLegendSVGSize();
            this.update();
        },
        watch: {

            // listen to changes
            data: function f() {
                this.update();
            },
            renderStyle: function f() {
                this.update();
            }
        },
        computed: {},

        methods: {
            /**
             * adjust the svg size
             */
            adjustDesktopSVGSize() {
                this.svg = this.$el.querySelector('svg');
                let vp = App.Helpers.getViewPort();
                let viewBox, width;
                if (vp.w > 1280) {
                    viewBox = '500 0 900 1000';
                    width = '100%';
                } else {
                    viewBox = '500 0 900 1150';
                    width = 900;
                }
                this.svg.setAttribute('viewBox', viewBox);
                this.svg.setAttribute('width', width);

            },
            /**
             * adjust the svg size
             */
            adjustLegendSVGSize() {
                let width = this.$el.clientWidth;
                if (width < 600) {
                    this.legendTranslateX = '350';
                    this.$el.querySelector('#geo_linear_gradient').style.width = '200px';
                }

            },
            update() {
                this.cleanCholorpleth();
                this.cleanBubble();
                if (this.renderStyle === CHOROPLETH) {
                    this.renderChoropleth();
                } else {
                    this.renderBubble();
                }
            },
            getSvg() {
                return this.$el.querySelector('svg');
            },
            /**
             *
             */
            renderChoropleth() {
                let map = this.$el;
                // check if
                let data = this.data;
                // get max code
                let max = _.max(_.map(data, e => e.v));
                let min = _.min(_.map(data, e => e.v));
                let range = max - min;
                range = range || 1;
                let countByCountries = _.groupBy(data, 'iso');
                let countries = App.Helpers.getSVGCountriesCodes();
                let gradientColors = JSON.parse(map.dataset['gradientColor']);
                let countrySvgShape;
                let color = function (value) {
                    return range > 1 ? App.Charts.getGradient(Math.max(((value * 0.9) - min), .9) / range, gradientColors) : gradientColors[0];
                }
                // TODO, optimize and clean
                countries.forEach(function (code) {
                    countrySvgShape = map.querySelector('#' + code);
                    if (countrySvgShape) {
                        let val = countByCountries[code] && countByCountries[code][0].v;
                        if (val) {
                            countrySvgShape.style.fill = val ? color(val) : 'white';
                            countrySvgShape.$ukC = val;
                            countrySvgShape.addEventListener('mouseover', ((event) => {
                                console.log(event.currentTarget.$ukC)
                            }));
                        }
                    }
                })
            },
            cleanCholorpleth() {
                let map = this.$el;
                let countries = App.Helpers.getSVGCountriesCodes();
                let countrySvgShape;
                countries.forEach(function (code) {
                    countrySvgShape = map.querySelector('#' + code);
                    if (countrySvgShape) {
                        countrySvgShape.style.fill = 'transparent';

                    }
                })
            },
            /**
             *
             * @param
             */
            renderBubble() {
                let info = this.data;
                let max = _.max(_.map(info, e => e.v));
                let min = _.min(_.map(info, e => e.v));
                let range = max - min;
                range = range || 1;
                //console.log('max ', max, 'min ', min, 'diff ', range);
                // remove old circles
                this.minValue = min;
                this.range = range;

                //
                let svg = this.getSvg();
                // single countries
                let defaultRadius = range > 1 ? 10 : BUBBLE_DEFAULT_RADIUS;
                let circle;
                _.each(info, el => {
                    let dom = svg.getElementById(el.iso);
                    if (dom) {
                        let b = dom.getBBox();
                        let cx = b.x + b.width / 2,
                            cy = b.y + b.height / 2;
                        let r = defaultRadius + ((el.v - min) / range) * 50;
                        circle = App.Charts.createSVGCircle({
                            r: 0,
                            cx: cx,
                            cy: cy,
                            fill: 'red',
                            'stroke-width': 20,
                            stroke: 'transparent',
                            'stroke-dasharray': '1000',
                            'stroke-dashoffset': '1000'
                        });
                        circle.dataset['val'] = r;
                        svg.appendChild(circle);
                        circle.classList.add(BUBBLE_CLASS);
                    } else {
                        // console.log(cId);
                    }
                });
                // 'circle-in-map'
                setTimeout(() => {
                    _.each(svg.getElementsByClassName(BUBBLE_CLASS), c => {
                        c.setAttribute('stroke-dashoffset', 0);
                        c.setAttribute('r', parseInt(c.dataset.val));
                    })
                }, 0);
                // clone bubble
                // vue will calculate all cicrle
                setTimeout(() => {
                    this._cloneLegend()
                })
            },
            _cloneLegend() {
                let svg = this.getSvg();
                let range = this.range;
                let id;
                if (range > 1) {
                    id = '#bubble_multi_circles_legend_to_clone';
                } else {
                    id = '#bubble_one_circle_legend_to_clone';
                    // center the text
                    setTimeout(() => {
                        let legend = document.querySelector('#' + BUBBLE_LEGEND_ID);
                        if (legend) {
                            let text = legend.querySelector('text');
                            let width = text.getBBox().width;
                            console.log('translate( ' + (25 - width / 2) + ', 80)');
                            // 25, center x
                            text.setAttribute('transform', 'translate( ' + (25 - width / 2) + ', 10)');
                        }
                    })
                }
                let calculated = document.querySelector(id);
                if (calculated) {
                    let clone = calculated.cloneNode(true);
                    clone.setAttribute('id', BUBBLE_LEGEND_ID);
                    svg.append(clone);
                }
            },
            /**
             *
             */
            cleanBubble() {
                // clear old circle
                let svg = this.getSvg();
                let old = svg.querySelectorAll('.' + BUBBLE_CLASS);
                for (let i = 0; i < old.length; i++) {
                    svg.removeChild(old.item(i));
                }
                this._clearBubbleLegend();
            },
            _clearBubbleLegend: function () {
                let svg = this.getSvg();
                let look = svg.querySelector('#' + BUBBLE_LEGEND_ID);
                if (look) {
                    svg.removeChild(look);
                }
            },

        },
    });
})();