const passport = require('passport');

const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},function(email,password,done){
    //find a user and establish the identity
    User.findOne({email:email},function(err,user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        if(!user || user.password != password){
            console.log('Invalid Username/Password');
            return done(null,false);
        }
        return done(null,user);
    });

}

));

//serialising the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
})

//deserializing the user from the key in the cookies

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding the user --> Passport Deserializing');
            return done(err);
        }
        return done(null,user);
    });
})

//check if the user is authenticated

passport.checkAuthentication = function(req,res,next){
    // if the user is signed in,then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not authenticated
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //whenever user is signed in the user info is available in req.user
        // but it is not sent in response local so we set it
        res.locals.user=req.user; 
    }
    next();
}
module.exports = passport;