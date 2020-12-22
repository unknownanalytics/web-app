App.Routes['/dashboard/stats/export'] = function () {
    new Vue({
        el: App.Helpers.getDashboardMainContainer(),
        template: '#app_dashboard_export_template',
        mounted() {
            this._initDraggable();
        },
        data: function () {
            return {}
        },
        methods: {
            _initDraggable() {
            }
        }
    })
};