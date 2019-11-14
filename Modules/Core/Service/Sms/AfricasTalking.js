const config = require('../../../../config/index');

class AfricasTalking {

    constructor(){
        this.client = require('africastalking')(config.sms.africastalking);
    }

    Sms (to, message) {
    
        let sms = this.client.SMS
    
        // Use the service
        const options = {
            to: to,
            message: message,
            // from: 'ServeMe'
        }
    
        // Send message and capture the response or error
        sms.send(options).then( response => {   
            console.log(response); 
        })
        .catch( error => {
                console.log(error);
        });
    }
}


module.exports = AfricasTalking