const { User } = require('../../User/models');
const AuthenticationService = require('../Service/AuthenticationService');
const passport = require('passport');
const auth = new AuthenticationService;

class AuthenticationController {

    constructor(){
        this.auth = auth;
    }

    static async register(req, res, next){
        try {
            
            let user = await auth.register(req);
            console.log(user)
            return res.status(201).json({ user: user, msg: 'Registration Successful, Please activate your account by visiting your mail.', token: user.temporarytoken });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    static async activateUser(req, res, next){

        try {
            let user = await auth.activate(req);

            if (user.is_active === true) return res.status(201).json({msg:'user activation successful'});
            if (user.is_active === false) return res.status(201).json({msg:'user de-activation successful'})
        } catch (error) {
            return res.json({ error: error, msg: error.message });
        }
        
    }

    static async login(req, res, next) {
        try {
            
            await passport.authenticate('local', { session: false }, function (user, err, info) {
                if (err) { return res.json(err) }
                if (!user) { return res.json(info) }
                req.logIn(user, { session: false }, function (err) {
                    if (err) { return res.json(err.message)  }
                        User.update( { last_login: new Date() }, { where:{ email: user.email } } );
                        user.authorize().then( data => {
                            return res.status(201).json({ 'msg': 'Login Successful!', data });
                        });
                });
            })(req, res, next);
            
        } catch (error) {
            return res.json({ error: error, msg: error.message });
        }
    }    

    static async logout(req, res, next) {

        try{
            
            await auth.logout(req);

            req.logout();

            return res.status(201).json({
                'msg': 'Logout Successfull!'
            });

        } catch (error) {
            return res.json({ error: error, msg: error.message });
        }        
    }
}

module.exports = AuthenticationController