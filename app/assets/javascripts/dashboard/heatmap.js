App.Routes['/dashboard/stats/heatmap'] = function () {
    let mainDom = App.Helpers.getDashboardMainContainer();
    let child;
    for (let i = 0; i < 6; i++) {
        child = document.createElement('div');
        child.classList.add('month-entry');
        mainDom.append(child);
        App.Charts.squares(child, {animate: false, x: 6, y: 7, stop: 31});
    }

};