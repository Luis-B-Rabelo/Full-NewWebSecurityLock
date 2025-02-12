import {Request, Response, Router} from "express";
import { AccountController } from "../MVC/Controllers/AccountController";

export class AccountRoutes
{
    private static readonly ROUTER = Router();
    
    public static async setRoutes(ipv4: string, port: string): Promise<Router>
    {
        //#region GET routes

        this.ROUTER.get("/registerAccount", async (req: Request, res: Response) =>
        {
            if(req.session.user != null && req.session.user.level < 2)
            {
                res.render("registerAccount", {ipv4: ipv4, account_id: req.session.user.account_id, user_name: req.session.user.user_name});
            }
            else
            {
                res.sendStatus(501);
            }
        });

        this.ROUTER.get("/registerWorkerAccount", async (req: Request, res: Response) =>
        {

            res.render("registerWorkerAccount", {ipv4: ipv4 });

        });

        this.ROUTER.get("/login", async (req: Request, res: Response) =>
        {
            res.render("login", {ipv4: ipv4});
        });

        this.ROUTER.get("/logout", (req: Request, res: Response) =>
        {
            if(req.session.user != null)
            {
                req.session.destroy((err: any) =>
                {
                    console.log(err);
                });

                res.redirect("/login");
            }
            else
            {
                res.send(501);
            }
        });
        
        this.ROUTER.get("/changePassword", async (req: Request, res: Response) =>
        {
            res.render("changePassword");
        });
        
        this.ROUTER.get("/changeUsername", async (req: Request, res: Response) =>
        {
            res.render("changeUsername");
        });

        //#endregion

        //#region POST routes

        this.ROUTER.post("/registerAccount", async (req: Request, res: Response) =>
        {
            let return_value: boolean = await AccountController.registerAccount(req.body.email, req.body.name, +req.body.level, req.body.password, ipv4, port);

            if(return_value == true)
            {
                res.redirect("/registerAccount");
            }
            else
            {
                res.sendStatus(501);
            }
        });

        this.ROUTER.post("/loginAccount", async (req: Request, res: Response) =>
        {
            let return_value: string = await AccountController.loginAccount(req.body.email, req.body.password, ipv4, port);

            if(return_value != "")
            {
                req.session.user = 
                {
                    token: return_value,
                    account_id: +return_value.split(":")[1]
                };

                res.redirect("/locks");
            }
            else
            {
                res.sendStatus(501);
            }
        });
        
        this.ROUTER.post("/changePassword", async (req: Request, res: Response) =>
        {
    
        });
        
        this.ROUTER.post("/changeUsername", async (req: Request, res: Response) =>
        {

        });

        //#endregion

        return this.ROUTER;
    }

}