import express, { Request, Response } from "express";
import { TokenRoutes } from "./Routes/TokenRoutes";
import { createKey, createIV } from "./Funcs/CipherComponentsFuncs";

const APP = express();

const BODY_PARSER = require("body-parser");

const PORT = process.env.PORT || 3003;
const IPV4 = require("./Funcs/GeneralFuncs").getLocalIPAddress();

const SCHEDULER = require("node-schedule");

APP.use(
    BODY_PARSER.urlencoded({
        extended: true,
    })
);

APP.listen(PORT, async () =>
{
    if(IPV4 != null)
    {
        await createKey();

        await createIV();

        console.log(`Server running at http://${IPV4}:${PORT}`);
    }
    else
    {
        console.log("Problem to get IPV4");
    }
});

APP.get("/", async (req: Request, res: Response) =>
{
    res.send("New WebSLToken API ");
});


TokenRoutes.setRoutes().then( (value) =>
{
    APP.use(value);
});

SCHEDULER.scheduleJob("0 0 * * *", async () => 
{
    await createKey();
});

SCHEDULER.scheduleJob("0 12 * * *", async () => 
{
    await createIV();
});

