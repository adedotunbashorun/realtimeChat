const { User,AuthToken } = require('../../User/models');
const UserEvent  = require('../../Core/Events/userEvents');


class AuthenticationService {

    events(user){
        return new UserEvent(user);
    }

    async register(req){   

        const { first_name, last_name, email, phone, password }  = req.body;

        const user = await User.create({ first_name: first_name, last_name: last_name, email: email, phone: phone, password: password});

        let UserEvents = this.events(user);
        UserEvents.emit('onRegister');
        
        return user;
    }

    async activate(req) {

        let user = await User.findOne({where: { id: req.params.id }});
        user.is_active =  (user.is_active == true) ? false : true;
        user.save();

        let UserEvents = this.events(user);
        UserEvents.emit('onActivate');

        return user;
    }

    async logout(req){
        
        let token = req.headers.authorization
        let UserEvents = this.events(req.user);
        UserEvents.emit('onLogout');
        return await AuthToken.destroy({ where: { token } });
    }
}


module.exports = AuthenticationService