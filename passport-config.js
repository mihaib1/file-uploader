import { UserActions } from "./db/queries.js";
const userActions = new UserActions();
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

export function initialize(passport){
    const authenticateUser = async(email, password, done) => {
        const user = await userActions.getUserByEmail(email);
        if(user.isSuccess){
            if(!user.records){
                return done(null, false, {message: "No user found for the given email!"});
            }
            try{
                if(await bcrypt.compare(password, user.records.password)){
                    return done(null, user.records);
                } else {
                    return done(null, false, { message: `Incorrect password`});
                }
            } catch(err){
                console.log(err);
                return done(err);
            }
        }
        if(!user.isSuccess){
            return done(null, false, {message: "Authentication error"});
        }
    }

    passport.use(new LocalStrategy({usernameField: "email"}, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try{
            const user = await userActions.getUserById(id);
            done(null, user.records);
        }
        catch(err){
            done(err);
        }
    })
}
