(function () {
    // Define a new component called button-counter
    Vue.component('app-v-typehead', {
        template: '<div class="typehead">' +
            '<input type="text"\n' +
            '           :placeholder="placeholder || \'...\'"\n' +
            '           autocomplete="off"\n' +
            '           style="width: 100%"' +
            '           v-model="query"\n' +
            '           @keydown.down="down"\n' +
            '           @keydown.up="up"\n' +
            '           @keydown.enter="hit"\n' +
            '           @keydown.esc="reset"\n' +
            '           @blur="reset"\n' +
            '           @input="input"/>\n' +
            '<!-- the list -->\n' +
            '      <ul  v-show="hasItems" class="typehead-list">\n' +
            '      <li v-for="(item, index) in filteredList" :class="\'entry \' + activeClass(index)" ' +
            '       @mousedown="hit(item)" ' +
            '       @mousemove="setActive(index)">\n' +
            '        <span v-bind:class="{ active: navIndex === index }" v-html="format(item)"></span>\n' +
            '      </li>\n' +
            '    </ul>' +
            '</div>'
        ,

        props: ['list', 'property', 'placeholder'],
        data() {
            return {
                filteredList: [],
                query: '',
                navIndex: -1,
                loading: false,
                selectFirst: false,
                hidden: true
            }
        },
        mounted() {

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

            cancel() {
                // used to 'cancel' previous searches
            },

            reset() {
                this.filteredList = [];
                this.query = '';
            },

            setActive(index) {
                this.navIndex = index;
            },

            activeClass(index) {
                return {
                    active: this.navIndex === index
                }
            },

            hit() {
                if (this.navIndex !== -1) {
                    this.$emit('selected', this.filteredList[this.navIndex]);
                }
            },

            up() {
                if (this.navIndex > 0) {
                    this.navIndex--
                } else if (this.navIndex === -1) {
                    this.navIndex = this.filteredList.length - 1
                } else {
                    this.navIndex = -1
                }
            },

            down() {
                if (this.navIndex < this.filteredList.length - 1) {
                    this.navIndex++
                } else {
                    this.navIndex = -1
                }
            },
            input() {
                let query = this.query;
                this.searchValueRegx = new RegExp(query);
                this.navIndex = -1;
                this.filteredList = (query.length && this.list.filter(e => this._getComparator(e).toLowerCase().indexOf(query) > -1)) || [];
            },
            enter() {
                //  alert(this.suggestionList[this.navIndex])
            },
            format(e) {
                return this._getComparator(e).replace(this.searchValueRegx, '<span class="match">' + this.searchValueRegx.source + '</span>')
            },
            esc() {
                this.filteredList = [];
                this.hidden = true;
                this.navIndex = -1;
            },
            _getComparator(e) {
                let property = this.property;
                return property ? e[property] : e
            }
        }
    })
})();