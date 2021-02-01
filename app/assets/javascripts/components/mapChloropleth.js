(function () {
    const CHOROPLETH = 'choropleth';
    const BUBBLE = 'bubble';
    const BUBBLE_CLASS = 'circle-in-map';
    const BUBBLE_LEGEND_ID = 'bubble_legend';
    const CHOROPLETH_LEGEND_ID = 'choropleth_legend';
    const BUBBLE_DEFAULT_RADIUS = 50;
    // Define a new component called button-counter
    Vue.component('app-v-choropleth-chart', {
        template: '#app_component_map_choropleth_template',
        props: ['data'],
        data() {
            return {
                range: 0,
                minValue: 0,
                renderStyle: CHOROPLETH,
                legendTranslateX: 0,
                defaultRadius: BUBBLE_DEFAULT_RADIUS,
                gradientColors: []
            }
        },
        mounted() {
            this.gradientColors = JSON.parse(this.$el.dataset['gradientColor']);
            this.adjustDesktopSVGSize();
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
                let width = this.$el.clientWidth;
                //
                if (width < 600) {
                    this.svg.setAttribute('viewBox', '200 0 1600 1000');
                    this.svg.setAttribute('height', '300');
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
                this.$emit('update-style', this.renderStyle);
            },
            getSvg() {
                return this.$el.querySelector('svg');
            },
            getTooltip() {
                return this.$el.querySelector('#tooltip');
            },
            _showTooltip(el) {
                if (!el) {
                    return;
                }
                var                  // get the borders of the path - see this question: http://stackoverflow.com/q/10643426/863110
                    bb = el.getBoundingClientRect();
                let tooltip = this.getTooltip();
                tooltip.style.display = 'initial';
                tooltip.innerHTML = el.dataset['name'] + '  ' + el.dataset.val;
                /*tooltip.style.top = bb.top - (bb.height / 2) + 'px';
                tooltip.style.left = bb.left - (bb.width / 2) + 'px';

                */// when mouse leave hide the tooltip

                el.addEventListener('mouseleave', ((event) => {
                    tooltip.style.display = 'none';
                }));

            },
            _hideTooltip(el) {

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
                this.minValue = min;
                this.range = range;
                let countByCountries = _.groupBy(data, 'iso');
                let countries = App.Helpers.getSVGCountriesCodes();
                let gradientColors = this.gradientColors;
                let countrySvgShape;
                let color = function (value) {
                    return range > 1 ? App.Charts.getGradient(Math.max(((value * 0.9) - min), .9) / range, gradientColors) : gradientColors[0];
                }
                // TODO, optimize and clean
                countries.forEach((code) => {
                    countrySvgShape = map.querySelector('#' + code);
                    if (countrySvgShape) {
                        let val = countByCountries[code] && countByCountries[code][0].v;
                        if (val) {
                            countrySvgShape.style.fill = val ? color(val) : 'white';
                            this.attachValuesToDom(countrySvgShape, val)
                        }
                    }
                })
                // clone bubble
                // vue will calculate all cicrle
                setTimeout(() => {
                    this._cloneChoroplethLegend()
                })
            },
            attachValuesToDom(dom, val) {
                dom.dataset['val'] = val;
                dom.addEventListener('mouseover', ((event) => {
                    this._showTooltip(event.currentTarget);
                }));
            },
            /**
             *
             * @private
             */
            _cloneChoroplethLegend() {
                let svg = this.getSvg();
                let id = '#line_legend_to_clone';
                let calculated = document.querySelector(id);
                if (calculated) {
                    let clone = calculated.cloneNode(true);
                    clone.setAttribute('id', CHOROPLETH_LEGEND_ID);
                    svg.append(clone);
                }
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
                this._clearCholorplethLegend();
            },
            _clearCholorplethLegend: function () {
                let svg = this.getSvg();
                let look = svg.querySelector('#' + CHOROPLETH_LEGEND_ID);
                if (look) {
                    svg.removeChild(look);
                }
            },
            /**
             *
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
                            'stroke-width': 10,
                            stroke: 'transparent',
                            'stroke-dasharray': '1000',
                            'stroke-dashoffset': '1000'
                        });
                        circle.dataset['radius'] = r;
                        svg.appendChild(circle);
                        circle.classList.add(BUBBLE_CLASS);
                        circle.dataset['name'] = dom.dataset['name'];
                        this.attachValuesToDom(circle, el.v);
                    } else {
                        // console.log(cId);
                    }
                });
                // 'circle-in-map'
                setTimeout(() => {
                    _.each(svg.getElementsByClassName(BUBBLE_CLASS), c => {
                        c.setAttribute('stroke-dashoffset', 0);
                        c.setAttribute('r', parseInt(c.dataset.radius));
                    })
                }, 0);
                // clone bubble
                // vue will calculate all cicrle
                setTimeout(() => {
                    this._cloneBubbleLegend()
                })
            },
            _cloneBubbleLegend() {
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
                            // console.log('translate( ' + (25 - width / 2) + ', 80)');
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