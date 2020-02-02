(function () {
    // Define a new component called button-counter
    Vue.component('app-v-typehead', {
        template: '<div class="typehead">' +
            '<input type="text"\n' +
            '           :placeholder="placeholder || \'...\'"\n' +
            '           autocomplete="off"\n' +
            '           v-model="query"\n' +
            '           @keydown.down="down"\n' +
            '           @keydown.up="up"\n' +
            '           @keydown.enter="hit"\n' +
            '           @keydown.esc="reset"\n' +
            '           @blur="reset"\n' +
            '           @input="update"/>\n' +
            '<!-- the list -->\n' +
            '    <ul v-show="hasItems">\n' +
            '      <!-- for vue@1.0 use: ($item, item) -->\n' +
            '      <li v-for="(item, $index) in filteredList" :class="activeClass($index)" @mousedown="hit(item)" @mousemove="setActive($index)">\n' +
            '        <span v-text="item[displayProperty]"></span>\n' +
            '      </li>\n' +
            '    </ul>' +
            '</div>',

        props: ['list', 'displayProperty', 'placeholder'],
        data() {
            return {
                filteredList: [],
                query: '',
                current: -1,
                loading: false,
                selectFirst: false,
                queryParamName: 'q'
            }
        },
        mounted() {
            this.filteredList = this.list;

        },
        computed: {
            hasItems() {
                return this.filteredList.length > 0
            },

            isEmpty() {
                return !this.query
            },

            isDirty() {
                return !!this.query
            }
        },

        methods: {
            update() {
                this.cancel();
                let query = this.query;
                if (!query) {
                    return this.reset()
                }
                this.filteredList = this.list.filter(e => e[this.displayProperty] && e[this.displayProperty].toLowerCase().indexOf(query.toLowerCase()) > -1);
                console.log(this.filteredList);
                /*if (this.minChars && this.query.length < this.minChars) {
                    return
                }

                this.loading = true */
                // for http
                /*
                this.fetch().then((response) => {
                    if (response && this.query) {
                        let data = response.data
                        data = this.prepareResponseData ? this.prepareResponseData(data) : data
                        this.filteredList = this.limit ? data.slice(0, this.limit) : data
                        this.current = -1
                        this.loading = false

                        if (this.selectFirst) {
                            this.down()
                        }
                    }
                })
            },

            fetch() {
                if (!this.$http) {
                    return util.warn('You need to provide a HTTP client', this)
                }

                if (!this.src) {
                    return util.warn('You need to set the `src` property', this)
                }

                const src = this.queryParamName
                    ? this.src
                    : this.src + this.query

                const params = this.queryParamName
                    ? Object.assign({[this.queryParamName]: this.query}, this.data)
                    : this.data

                let cancel = new Promise((resolve) => this.cancel = resolve)
                let request = this.$http.get(src, {params})

                return Promise.race([cancel, request])*/
            },

            cancel() {
                // used to 'cancel' previous searches
            },

            reset() {
                this.filteredList = [];
                this.query = '';
                this.loading = false;
            },

            setActive(item, index) {
                this.current = index;
            },

            activeClass(index) {
                return {
                    active: this.current === index
                }
            },

            hit() {
                if (this.current !== -1) {
                    this.onHit(this.filteredList[this.current])
                }
            },

            up() {
                if (this.current > 0) {
                    this.current--
                } else if (this.current === -1) {
                    this.current = this.filteredList.length - 1
                } else {
                    this.current = -1
                }
            },

            down() {
                if (this.current < this.filteredList.length - 1) {
                    this.current++
                } else {
                    this.current = -1
                }
            },

            onHit(item) {
                this.$emit('seleced', item);
               // console.warn('You need to implement the `onHit` method', this)
            }
        }
    })
})();