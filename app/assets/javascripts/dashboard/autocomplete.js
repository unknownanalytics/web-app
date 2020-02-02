(function () {
    new Vue({
        el: '#navbar_header_form',
        mounted() {

        },
        data: function () {
            return {
                commands: ['top', 'but', 'kie', 'toot', 'toyoata'],
                suggestionList: [],
                hidden: false,
                searchValueRegx: '',
                navIndex: -1,
                width: document.getElementById('navbar_header_form_search').clientWidth
            }
        },
        methods: {
            input(event) {
                let search = event.currentTarget.value;
                this.searchValueRegx = new RegExp(search);
                this.hidden = false;
                this.navIndex = -1;
                this.suggestionList = (search.length && this.commands.filter(e => e.toLowerCase().indexOf(search) > -1)) || [];
            },
            enter() {
                alert(this.suggestionList[this.navIndex])
            },
            up() {
                if (--this.navIndex < 0) {
                    this.navIndex = this.suggestionList.length - 1;
                }
            },
            format(entry) {
                console.log(this.searchValueRegx);
                return entry.replace(this.searchValueRegx, '<span class="match">' + this.searchValueRegx.source + '</span>')
            },
            down() {
                if (++this.navIndex > Math.max(this.suggestionList.length - 1)) {
                    this.navIndex = 0
                }
            },
            esc() {
                this.suggestionList = [];
                this.hidden = true;
                this.navIndex = -1;
            }
        }
    })
})();