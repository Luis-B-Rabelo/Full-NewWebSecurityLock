import path from "path";
import express, { Request, Response } from "express";
import session from 'express-session';
import { AccountRoutes } from "./Routes/AccountRoutes";
import { LockRoutes } from "./Routes/LockRoutes";

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const APP = express();

const SESSION = session;

const BODY_PARSER = require("body-parser");
const PORT = process.env.PORT || 3000;
const IPV4 = require("./Funcs/GeneralFuncs").getLocalIPAddress();

APP.use( SESSION
({
    secret: "newwebsecuritylock",
    resave: false,
    saveUninitialized: false,
}));

APP.use(
    BODY_PARSER.urlencoded({
        extended: true,
    })
);

APP.set("view engine", "ejs");

APP.set("views", path.join(__dirname, "MVC/Views"));

APP.use(express.static(path.join(__dirname, "../rsrc/public")));

APP.listen(PORT, async () =>
{
    if(IPV4 != null)
    {

        console.log(`Server running at http://${IPV4}:${PORT}`);
    }
    else
    {
        console.log("Problem to get IPV4");
    }
});

APP.get("/", async (req: Request, res: Response) =>
{
    res.redirect("/login");
});

AccountRoutes.setRoutes(IPV4, "3001").then( (value) =>
{
    APP.use(value);
});

LockRoutes.setRoutes(IPV4, "3002").then( (value) =>
{
    APP.use(value);
});

