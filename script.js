import "dotenv/config";
const PORT = process.env.PORT ? process.env.PORT : 3000;

import flash from "express-flash";
import methodOverride from "method-override";

import path from "node:path";

import express from "express";
import session from "express-session";
import passport from "passport";
import { initialize } from "./passport-config.js";

import multer from "multer";

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";

import { fileURLToPath } from "node:url";

import { indexRouter } from "./routers/indexRouter.js";
import { filesRouter } from "./routers/filesRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

initialize(passport);
app.use(
  session({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/bootstrap", express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use("/", indexRouter);
app.use("/files", filesRouter);

app.use(methodOverride("_method"));

app.delete("/logout", (req, res, next) => {
    req.logout(function(err){
        if(err) return next(err);
        res.redirect("/");
    });
});

const upload = multer({dest: "uploads/"});

app.listen(PORT, function(err){
    if(err){
        throw(err);
    }
    console.log(`Listening on port ${PORT}`);
})