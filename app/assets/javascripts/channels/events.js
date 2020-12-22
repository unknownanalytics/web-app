// app/assets/javascripts/channels/events.js

App.cable = ActionCable.createConsumer();

App.messages = App.cable.subscriptions.create('WebNotificationsChannel', {
    received: function (data) {
        console.log(data);
    },
    connected : function (data) {
        console.log(data)
    }
});