const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '413631676663-q4u3s67aisbhdorbtra2ptc3no5rhtlk.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
