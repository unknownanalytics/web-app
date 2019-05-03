//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
//# You can use CoffeeScript in this file: http://coffeescript.org/
document.addEventListener("DOMContentLoaded", function () {
    var dropdown = document.querySelector('.dropdown');
    dropdown.addEventListener('click', function (event) {
        event.stopPropagation();
        dropdown.classList.toggle('is-active');
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
    let map = Rails.$('#map')[0];
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
});