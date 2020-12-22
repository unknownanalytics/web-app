//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
//# You can use CoffeeScript in this file: http://coffeescript.org/
document.addEventListener("turbolinks:load", function (event) {
    var dropdowns = document.querySelectorAll('.header-dropdown');
    if (dropdowns.length){

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
        let map = Rails.$('#map_hero')[0];
        let paths = map.querySelectorAll('path');
        let index = null;
        setInterval(function () {
            index = Math.floor(Math.random() * paths.length);
            paths[index].style.fill = "red"; //Set stroke colour
            paths[index].style.zoom = 10; //Set stroke colour
        }, 1000);

        App.Charts.bars('hero_events_chart', [1, 1, 2, 4, 2, 5, 2, 4, 2, 1, 6, 5, 1, 1, 2, 4, 2, 5, 2, 4, 2, 1, 6, 5]);
        //App.Charts.squares('features_heatmap');
        App.Charts.bubble('hero_campaigns', [1, 2, 1, 2, 4, 2, 5, 2, 4, 2, 1, 6, 5]);

        let tabsWithContent = (function () {
            let tabs = document.querySelectorAll('#product li');
            let tabsContent = document.querySelectorAll('.tab-content');

            let deactvateAllTabs = function () {
                tabs.forEach(function (tab) {
                    tab.classList.remove('is-active');
                });
            };

            let hideTabsContent = function () {
                tabsContent.forEach(function (tabContent) {
                    tabContent.classList.remove('is-active');
                });
            };

            let activateTabsContent = function (tab) {
                tabsContent[getIndex(tab)].classList.add('is-active');
            };

            let getIndex = function (el) {
                return [...el.parentElement.children].indexOf(el);
            };

            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    deactvateAllTabs();
                    hideTabsContent();
                    tab.classList.add('is-active');
                    activateTabsContent(tab);
                });
            });
            tabs[0].click();
        })();
    }

});