
#### Declare route name  
```
var main = document.getElementsByTagName('main')[0] ;
App.Routes[<route_name>] = function () {
    new Vue({
        el: main,
        template: '#<template_id>',
        mounted() {

        },
        data: function () {
            return {}
        },
        methods: {}

    })
};
```