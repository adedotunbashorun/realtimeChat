const EventEmitter = require('events').EventEmitter;
const Core = require('../Service/CoreService');
const Sms = require('../Service/Sms/AfricasTalking');
const Notification = require('../../Notifications/Service/NotificationsService');
const CoreService = new Core();
const SmsService = new Sms();

class userEvents extends EventEmitter {
    
    constructor(user, req) {
        super();
        this.user = user;
        this.req = req
        // Become eaten when gator emits 'gatorEat'
        this.on('onRegister', this.onRegister);
    }

    async onRegister(){

        let user = this.user;

        // CoreService.Email(user, 'New Registration', CoreService.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at fashionCast.<br> Please click the link below to complete registration https://fashioncastapi.herokuapp.com/api/activate/' + user.temporarytoken + '</p>'));

        // SmsService.Sms(user.phone, 'Hello '+ user.first_name+' this is your activation code '+user.phone_code);

        CoreService.activity_log(this.req, user.id, 'Registered');

        Notification.triggerNotification('notifications','users',{user, message: {msg: user.last_name + " Just created a new account."}},this.req);

        
    }

    async onActivate(){

        let user = this.user;

        if (user.is_active == false) {
            CoreService.Email(user, 'Account De-activated', CoreService.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for using Refill. Your Account has been de-activated please contact support for re-activation @ refill.com.ng \n\r Thank You.'));
        } else {
            CoreService.Email(user, 'Account Activated', CoreService.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Refill. Your Account has been activated successfully.'));
        } 
        CoreService.activity_log(this.req, user.id, 'Activated Account')
    }

    async onLogin(){

        let user = this.user;
        
        CoreService.activity_log(this.req, user.id, 'User logged into account')
    }

    async onLogout(){

        let user = this.user;
        
        CoreService.activity_log(this.req, user.id, 'User logged out of account')
    }
}

module.exports = userEvents