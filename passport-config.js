var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    // GoogleStrategy = require('passport-google-oauth20').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('./nodemon.json')
const User = require('./Modules/User/Models/User');


passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (username, password, done) => {
        User.findOne({ email: username, deleted_at: null }).exec((err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { error: true, message: 'Incorrect username.' });
            }
            if (!user.isValid(password)) {
                return done(null, false, { error: true, message: 'Incorrect password.' });
            }
            if (user.is_active == false) {
                return done(null, false, { error: true, message: 'User Not Activated.' });
            }
            return done(null, user);
        });
    }
));

passport.use('facebook',new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_URL,
    profileFields: ["email", "name"],
  },
  (accessToken, refreshToken, profile, done) => {
    const { email, first_name, last_name } = profile._json;
    User.findOne({ email: email, deleted_at: null }).exec((err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { error: true, message: 'Incorrect username.' });
        }
        var userData = new User({
            first_name : first_name,
            last_name: last_name,
            username : email,
            password : last_name,
            email: email,
            facebookId : ''
        });

        userData.save(function (err, newuser) {
            if (err) {
                return cb(null, false, {message : err + " !!! Please try again"});
            }else{
                return cb(null, newuser);
            }
        });
    })
  }
));

// passport.use('google', new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
//     callbackURL: process.env.GOOGLE_CONSUMER_URL
//   },
//   (token, tokenSecret, profile, done) => {
//     User.findOne({ googleId : profile.id }, (err, user) => {
//         if(err){
//             return cb(err, false, {message : err});
//         }else {
//             if (user != '' && user != null) {
//                 return cb(null, user, {message : "User "});
//             } else {
//                 var name  = profile.displayName.split(' ');
//                 var userData = new User({
//                     first_name : name[0],
//                     last_name: name[1],
//                     username : name[0],
//                     password : name[0],
//                     email: profile._json.email,
//                     facebookId : '',
//                     googleId : profile.id,
//                 });
//                 // send email to user just in case required to send the newly created
//                 // credentails to user for future login without using google login
//                 userData.save(function (err, newuser) {
//                     if (err) {
//                         return cb(null, false, {message : err + " !!! Please try again"});
//                     }else{
//                         return cb(null, newuser);
//                     }
//                 });
//             }
//         }
//     });
//   }
// ));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'realtimeChat'
    },
    (jwtPayload, cb) => {
        
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));