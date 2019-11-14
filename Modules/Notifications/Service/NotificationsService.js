let Pushers= require('pusher')
let pusher_notifiction = new Pushers({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
})
let { Notification } = require('../models')
class NotificationsService {

    constructor(){        
        this.pushers = pusher_notifiction               
    }

    static triggerNotification(notifications = 'notifications', type, data,req) {
        // pusher_notifiction.trigger(notifications, type, data, req.headers['x-socket-id']);
        return this.saveNotification(notifications = 'notifications', type, data);          
    }

    static saveNotification(notifications = 'notifications', type, data){
        let notify = Notification.create({
            name: notifications,
            type: type,
            data: JSON.stringify(data)
        });
        return notify
    }

}


module.exports = NotificationsService