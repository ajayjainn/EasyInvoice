import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import passport from 'passport'
import User from '../models/User.js'

const googleAuth = () => {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/api/v1/auth/google/callback`,
    },
    ((accessToken, refreshToken, profile, cb) => {
      if (process.env.NODE_ENV === 'development') console.log('Google profile', profile)
      User
        .findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (!currentUser) {
            const name = profile.displayName.split(' ')
            new User({
              googleId: profile.id,
              username: profile._json.given_name,
              firstName: name[0],
              lastName: name[1],
              email: profile._json.email,
              avatar: profile._json.picture,
              isEmailVerified: profile._json.email_verified,
              provider: 'google',
            })
              .save()
              .then((newUser) => {
                console.log('new user created: ', newUser)
                cb(null, newUser)
              })
              .catch((err) => {
                cb(err, false)
              })
          } else {
            console.log('user is: ', currentUser)
            cb(null, currentUser)
          }
        })
        .catch((err) => {
          console.log(err)
          cb(err, false)
        })
    }),
  ))
}

export default googleAuth
