export class AuthenticationUtils {
    checkAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } 
        return res.redirect("/");
    }

    checkNotAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return res.redirect(`/user-page`);
        }
        next();
    }

    checkAuthBeforeRegistering(req, res, next){
        if(req.isAuthenticated()){
            return res.render('user-page');
        } else {
            return res.render("register");
        }
    }
}
