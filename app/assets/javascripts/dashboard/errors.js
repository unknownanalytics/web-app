App.Routes['/dashboard/stats/errors'] = function () {
    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_errors_template',

        mounted() {
            this.loadData({});
            this.loadIcons();
        },
        data() {
            return {

                pages: [],
                errors: [],
                startDate: null,
                endDate: null,
                selectedPage: null,
                pageIndex: 0,
                isLoading: false,
                hasMorePages: true,
                iconsSrcByBrowser: {}
            }
        },
        methods: {
            _getDefaultFilterParams() {
                let page = this.selectedPage;
                return page ? {page_id: page.id} : {};
            },
            /**
             *
             * @param page
             */
            onSelectedPage(page) {
                this.selectedPage = page;
                this.loadData({resetPagination: true});
            },
            onChangeStartDate(event) {
                this.startDate = event && event.target.value;
                this.loadData({resetPagination: true});
            },
            onChangeEndDate(event) {
                this.endDate = event && event.target.value;
                this.loadData({resetPagination: true});
            },
            loadData({resetPagination = false}) {
                if (!this.isLoading) {
                    this.isLoading = true;
                    let params = this._getDefaultFilterParams();
                    if (resetPagination) {
                        this._resetData();
                    }
                    params = Object.assign({}, params, {
                        from: this.startDate,
                        to: this.endDate,
                        xPage: ++this.pageIndex
                    });
                    App.Api.get(App.API_ROUTES.DASHBOARD_ERRORS, params, {
                        success: this.successLoadData,
                        error: this.failLoadData
                    });
                }
            },
            loadMore() {
                this.loadData({resetPagination: false});
            },
            _resetData() {
                this.pageIndex = 0;
                this.errors = [];
                this.hasMorePages = true;
            },
            successLoadData(response) {
                if (response) {
                    this.pages = response.data.pages;
                    if (response.data.errors) {
                        // let newErrors = response.data.errors;
                        let newErrors = this.formatErrors(response.data.errors);
                        this.hasMorePages = newErrors.length === response.data.perPage;
                        this.errors = this.errors.concat(newErrors);

                    }

                }
                this.isLoading = false;
            },
            failLoadData(response) {
                this.isLoading = false;
            },
            /**
             * Extract and format errors
             * @param newErrors
             */
            formatErrors(newErrors) {
                newErrors.forEach((e) => {
                    if (e.metadata && e.metadata.info) {
                        if (e.metadata.info.msg) {
                            // e.type = e.metadata.info.msg.replace(/(?<error>[a-zA-z]+Error)/, '<span class="has-error">$<error></span>')
                            // use capture instead
                            e.type = e.metadata.info.msg.match(/([a-zA-z]+Error)/g)[0]
                            // TODO
                            if (!e.type) {
                                e.type = e.metadata.info.msg.match(/([a-zA-z]+Event)/g)[0]
                            }
                        } else {
                            if (e.metadata.info.error) {
                                // e.type = e.metadata.info.msg.replace(/(?<error>[a-zA-z]+Error)/, '<span class="has-error">$<error></span>')
                                // use capture instead
                                e.type = e.metadata.info.error.match && e.metadata.info.error.match(/([a-zA-z]+Error)/g)[0];
                                e.metadata.info.msg = e.metadata.info.error;
                                // TODO
                                if (!e.type) {
                                    e.type = e.metadata.info.msg.match && e.metadata.info.msg.match(/([a-zA-z]+Event)/g)[0]
                                }

                            }
                        }
                        if (e.browser) {
                            e.icon = this._getIcon(e.browser);
                        }
                    }
                });
                return newErrors;
            },
            /**
             *
             * @param {string} browser
             * @returns {boolean| string}
             * @private
             */
            _getIcon(browser) {
                let foundKey;
                let found = Object.keys(this.iconsSrcByBrowser).find(key => {
                    // save the key
                    foundKey = key;
                    return browser.toLowerCase().indexOf(key) > -1;
                });
                return found ? this.iconsSrcByBrowser[foundKey] : false;
            },
            loadIcons() {
                let items = document.querySelectorAll('.browser-icon');
                Array.from(items).forEach(entry => {
                    this.iconsSrcByBrowser[entry.dataset['for']] = entry.dataset['src'];
                });
            }
        }
    });
};
