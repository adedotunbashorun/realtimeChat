const { ActivityLog } = require('../models');

const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const config = require('../../../config/index');
class CoreService {

    constructor(){
        this.client = nodemailer.createTransport(sgTransport(config.mail))
    }

    async activity_log (req, user_id, description) {
        if (user_id) {
            let logs = await ActivityLog.create({
                user_id: user_id,
                description: description,
                ip_address: req.header('x-forwarded-for') || req.connection.remoteAddress
            });

            return logs;
        }
    }

    Email(data, subject, message) {
        try {
            var email = {
                from: config.app_name,
                to: (data.email) ? data.email : config.email,
                subject: subject,
                html: message
            }
    
            this.client.sendMail(email, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Message sent: " + info.response)
                }
            })
        } catch (error) {
            return res.status(401).json({ "success": false, "message": error })
        }
    }
    
    
    html (data){
        return  '<div id="content" style="background-color: #1D4BB7width:100%">'+
            '<nav>'+
                '<div class="container-fluid">'+
                        '<span><a href="https://refill-app.herokuapp.com"><img src="https://refillappapi.herokuapp.com/uploads/images/refill_logo.png" style="width: 120px height: 45px padding:10px" class="img-responsive"></a></span>'+
                '</div>'+
            '</nav>'+
            '<div style="background-color: #fefefepadding:20pxcolor:#000">'+ data + '</div>'+
        '</div>';
    }
}


module.exports = CoreService