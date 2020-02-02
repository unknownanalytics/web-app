App.Routes['/dashboard/stats/heatmaps'] = function () {

    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_heatmaps_template',
        mounted() {
            this.updateData();

            this.drawMonths();
        },
        methods: {
            updateData() {

            },
            onChangePeriodTopPagesViews() {

            },
            drawMonths() {
                let container = document.getElementById('months');
                let child;
                for (let i = 0; i < 6; i++) {
                    child = document.createElement('div');
                    child.classList.add('month-entry');
                    container.append(child);
                    App.Charts.squares(child, [], {animate: false, x: 6, y: 7, stop: 31, size: 25});
                }
            }
        }
    });
};