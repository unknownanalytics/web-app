App.Routes['/dashboard/stats/errors'] = function () {
    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_errors_template',
        mounted() {
            this.reloadAll();
        },
        data() {
            return {
                data: {
                    errors: [],
                    pages: []
                },
                selectedPage: null,
                weekDay: {
                    startRange: moment().startOf('isoWeek').format('YYYY-MM-DD')
                }
            }
        },
        methods: {
            _getDefaultFilterParams() {
                let page = this.selectedPage;
                return page ? {page_id: page.id} : {};
            },
            /**
             *
             */
            clearCurrentPage() {
                this.selectedPage = null;
                this.reloadAll();
            },
            /**
             *
             * @param page
             */
            onSelectedPage(page) {
                this.selectedPage = page;
                this.reloadAll();
            },
            /**
             *
             */
            reloadAll() {
                this.onChangeWeekDayFilter();
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
                console.log(params);
                App.Api.get(App.API_ROUTES.DASHBOARD_ERRORS, params, {success: this.successLoadData});
            },
            successLoadData(response) {
                if (response){
                    this.data.pages = response.data.pages ;
                    this.errors = response.data.errors;
                }
            }
        }
    });
};
