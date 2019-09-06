// app/assets/javascripts/channels/messages.js

App.cable = ActionCable.createConsumer();

App.messages = App.cable.subscriptions.create('WebNotificationsChannel', {
    received: function (data) {
        console.log(data);
    }
});