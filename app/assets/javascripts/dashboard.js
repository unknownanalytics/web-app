//# Place all the behaviors and hooks related to the matching controller here.
//# All this logic will automatically be available in application.js.
//# You can use CoffeeScript in this file: http://coffeescript.org/
//= require_directory ./dashboard
// require vuejs
//= require_directory ./components
document.addEventListener("turbolinks:load", function (event) {
    let path = (new URL(event.data.url)).pathname;
    if (App.Routes[path]) {
        App.Routes[path]();
    }
    // main search element
    new Vue({
        el: '#navbar_header_form',
        data: function () {
            return {
                commands: ['top', 'but', 'kie', 'toot', 'toyoata'],
            }
        },
        methods: {
            changeFilterPath(item) {
                alert(item)
            }
        }
    })
});