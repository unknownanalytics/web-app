(function () {
    // Define a new component called button-counter
    Vue.component('app-v-heatmap-chart', {
        template: '#app_component_heatmap_template',
        props: ['data'],
        data() {
            return {
            }
        },
        mounted() {
            let container = this.$el.querySelector('.heatmap-months-container');
            let child;
            for (let i = 0; i < 6; i++) {
                child = document.createElement('div');
                child.classList.add('month-entry');
                container.append(child);
                App.Charts.squares(child, [], {animate: false, x: 6, y: 7, stop: 31, size: 20});
            }
        },
        computed: {},

        methods: {}
    })
})();