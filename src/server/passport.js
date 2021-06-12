if (process.env.NODE_ENV != 'production') require("dotenv").config()
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("./models/users")

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PASSPORTSECRET,
}

function passportStrategy(passport) {
    passport.use(
        new JwtStrategy(options, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false)
            })
            .catch(err => console.log(err))
        })
    ) 
}

module.exports = passportStrategy