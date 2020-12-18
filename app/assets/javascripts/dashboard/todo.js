App.Routes['/dashboard/stats/heatmaps'] = function () {
    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_heatmaps_template'
    });
};

App.Routes['/dashboard/stats/errors'] = function () {
    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_errors_template',
    });
};


App.Routes['/dashboard/stats/events'] = function () {
    let mainDom = App.Helpers.getDashboardMainContainer();
    new Vue({
        el: mainDom,
        template: '#app_dashboard_events_template'
    });
};