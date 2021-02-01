// app/assets/javascripts/channels/events.js

App.cable = ActionCable.createConsumer();

App.messages = App.cable.subscriptions.create('WebNotificationsChannel', {
    received: function (data) {
       App.Helpers.log(data);
    },
    connected : function (data) {
        App.Helpers.log(data);
    }
});