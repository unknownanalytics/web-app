App.Routes['/dashboard/stats/heatmaps'] = function () {

    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_heatmaps_template',
        mounted() {
            this.updateData();
        },
        methods: {
            updateData() {

            },
            onChangePeriodTopPagesViews() {

            }
        }
    });
};