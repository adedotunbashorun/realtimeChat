const { User,AuthToken } = require('../../User/models');
const UserEvent  = require('../../Core/Events/userEvents');
const { ErrorHandler } = require('../../../helpers/error');

class AuthenticationService {

    events(user, req){
        return new UserEvent(user, req);
    }

    async register(req){   

        const { first_name, last_name, email, phone, password }  = req.body;

        if (!email || !password || !first_name || !last_name || !phone) {
            throw new ErrorHandler(404, 'Missing required fields')
        }

        try {
            const user = await User.create({ first_name: first_name, last_name: last_name, email: email, phone: phone, password: password});
        
            let data = await user.authorize();
            let UserEvents = this.events(user, req);
            UserEvents.emit('onRegister');
            
            return data;

        } catch (error) {
            throw new ErrorHandler(501, error.message);
        }
    }

    async activate(req) {

        let user = await User.findOne({where: { id: req.params.id }});
        user.is_active =  (user.is_active == true) ? false : true;
        user.save();

        let UserEvents = this.events(user, req);
        UserEvents.emit('onActivate');

        return user;
    }

    async logout(req){
        
        let token = req.headers.authorization
        let UserEvents = this.events(req.user, req);
        UserEvents.emit('onLogout');
        return await AuthToken.destroy({ where: { token } });
    }
}


module.exports = AuthenticationService