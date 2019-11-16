var passport = require('passport');
const { User, AuthToken } = require('../Modules/User/models');
module.exports = {
    isValidUser: function(req, res, next){
        if (passport.authenticate('jwt', { session: false })) {
            const authHeader = req.cookies.auth_token || req.headers.authorization;
            const token = authHeader.split(' ')[1];
            if (token) {                
                // look for an auth token that matches the cookie or header
                const authToken = AuthToken.find({ where: { token }, include: User });

                if (authToken) {
                    req.user = authToken.User;
                }
            }
            next();
        } else return res.status(401).json({ 'msg': 'UnAuthorized Request!' })
    },
}