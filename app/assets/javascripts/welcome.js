//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
//# You can use CoffeeScript in this file: http://coffeescript.org/
document.addEventListener("DOMContentLoaded", function () {
    var dropdowns = document.querySelectorAll('.header-dropdown');
    let closeAll = function () {
        dropdowns.forEach(entry => {
            entry.classList.remove('is-active');
        })
    };
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (event) {
            closeAll();
            event.stopPropagation();
            event.currentTarget.classList.toggle('is-active');
        });
    });
    // animate events box
    let chart = Rails.$('#hero_events_chart')[0];
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
    chart.appendChild(newElement);
    setInterval(function () {
        let cx = Math.floor(Math.random() * 400) + 5;
        let cy = Math.floor(Math.random() * 120) + 5;
        newElement.setAttribute("cx", "" + cx); //Set path's data
        newElement.setAttribute("cy", "" + cy); //Set path's data
        newElement.setAttribute("r", "5"); //Set path's data
        newElement.style.fill = "#000"; //Set stroke colour
    }, 2000);


    // animate events box
    let map = Rails.$('#map_hero')[0];
    let paths = map.querySelectorAll('path');
    let index = null;
    setInterval(function () {
        if (index) {
            paths[index].style.fill = "#bac5f4";
            paths[index].style.zoom = 1;
        }
        index = Math.floor(Math.random() * paths.length);
        paths[index].style.fill = "red"; //Set stroke colour
        paths[index].style.zoom = 10; //Set stroke colour
    }, 1000);

    // animate canvas
    var canvas = document.querySelector('#welcome_demo_heatmap_mobile canvas');
    if (canvas) {
        alert('exists');
    }

    App.Charts.squares('features_heatmap');
    App.Charts.bubble('features_views', [1, 2, 1, 2, 4, 2, 5, 2, 4, 2, 1, 6, 5]);

});