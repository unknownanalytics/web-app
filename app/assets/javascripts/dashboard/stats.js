
App.Routes['/dashboard/stats/pages'] = function () {
    console.log('/dashboard/stats/pages');
    new Vue({
        el: document.getElementsByTagName('main')[0],
        template: '#app_dashboard_views_template',
        mounted() {
            Rails.ajax({
                url: App.API_ROUTES.DASHBOARD_STATS_PAGES,
                type: "get",
                dataType: 'json',
                success: (response) => {
                    this.stats = response.data;
                    statsCanvasViews();
                },
                error: function (data) {
                }
            });
        },
        data: function () {
            return {
                stats: {
                    pages: 0,
                    pagesCount: 10,
                }
            }
        },

    })
};
function statsCanvasViews() {
    // And for a doughnut chart
    var ctx = document.getElementById('canvas_views_stats').getContext('2d');
    console.log(ctx);
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
