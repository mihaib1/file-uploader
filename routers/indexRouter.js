import { Router } from "express";
let indexRouter = Router();

import FolderController from "../controllers/filesController.js";
const folderController = new FolderController();

import { ControllerActions } from "../controllers/registerController.js"
import { LoginController } from "../controllers/loginController.js";
const loginActions = new LoginController();

import { AuthenticationUtils } from "../authUtils.js";
import passport from "passport";
const authUtils = new AuthenticationUtils();

indexRouter.get("/", authUtils.checkNotAuthenticated, (req, res) => {
    res.render("login");
});

const authenticationRedirect = {
    successRedirect: "/user-page",
    failureRedirect: "/",
    failureFlash: true
}

indexRouter.post("/login", authUtils.checkNotAuthenticated, passport.authenticate("local", authenticationRedirect));

indexRouter.get("/register", authUtils.checkAuthBeforeRegistering);

indexRouter.post("/register", async (req, res) => {
    const userData = req.body;
    const userActions = new ControllerActions();
    let registrationResult = await userActions.createUser(userData);
    if(registrationResult.isSuccess){
        res.redirect("/"); // Redirects to login page.
    } else {
        // should also display a message saying that there was an error.
        res.redirect("/register");
    }
});

indexRouter.get("/user-page", async (req, res) => {
    const foldersList = await folderController.getFolderByUser(req.user.id);
    res.render("user-page", {user: req.user, foldersList: foldersList});
})

export {indexRouter}