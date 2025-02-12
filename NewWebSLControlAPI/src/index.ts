import express, { Request, Response } from "express";
import { LockRoutes } from "./Routes/LockRoutes";

const APP = express();

const BODY_PARSER = require("body-parser");
const PORT = process.env.PORT || 3002;
const IPV4 = require("./Funcs/GeneralFuncs").getLocalIPAddress();

APP.use(
    BODY_PARSER.urlencoded({
        extended: true,
    })
);

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
    res.send("New WebSLControl API ");
});

LockRoutes.setRoutes().then( (value) =>
{
    APP.use(value);
});
    
