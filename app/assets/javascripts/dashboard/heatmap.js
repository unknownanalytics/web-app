App.Routes['/dashboard/stats/heatmap'] = function () {

    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_heatmap_template',
        mounted() {
            this.updateData();
        },
        methods: {
            updateData() {
                let container = document.getElementById('container');
                let child;
                for (let i = 0; i < 6; i++) {
                    child = document.createElement('div');
                    child.classList.add('month-entry');
                    container.append(child);
                    App.Charts.squares(child, [], {animate: false, x: 6, y: 7, stop: 31});
                }
            }
        }
    });
};