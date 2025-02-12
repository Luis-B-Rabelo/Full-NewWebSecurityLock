import {Request, Response, Router} from "express";
import { IInfos, ILocksInfos, IUsers } from "../Interfaces/ILocks";
import { LockController } from "../MVC/Controllers/LockController";
import { verifyToken } from "../Funcs/GeneralFuncs";

export class LockRoutes
{
    private static readonly ROUTER = Router();
    
    public static async setRoutes(ipv4: string, port: string): Promise<Router>
    {
        //#region GET routes

        this.ROUTER.get("/locks", async (req: Request, res: Response) =>
        {
            if(req.session.user != null)
            {
                if(req.session.user.user_name == null)
                {
                    let user: IUsers|null = await LockController.getUser(+req.session.user.account_id, ipv4, port);

                    if(user != null)
                    {
                        req.session.user = 
                        {
                            token: req.session.user.token,
                            account_id: +req.session.user.account_id,
                            user_name: user.name,
                            level: user.level
                        };
        
                        console.log(req.session.user);
                    }
                    else
                    {
                        res.sendStatus(501);
                    }
                }

                if(req.session.user.level > 1)
                {
                    let locks = await LockController.getUserLocks(req.session.user.account_id, ipv4, port);

                    res.render("locks", {locks: locks, account_id: req.session.user.account_id, user_name: req.session.user.user_name});
                }
                else
                {
                    res.redirect("/registerAccount");
                }
            }
            else
            {
                res.sendStatus(501);
            }
   
        });

        this.ROUTER.get("/registerLock", async (req: Request, res: Response) =>
        {
            if(req.session.user != null && req.session.user.level < 2)
            {
                res.render("registerLock", {ipv4: ipv4, account_id: req.session.user.account_id, user_name: req.session.user.user_name});
            }
            else
            {
                res.sendStatus(501);
            }
        });

        //#endregion

        //#region POST routes

        this.ROUTER.post("/registerLock", async (req: Request, res: Response) =>
        {
            if(req.session.user != null && await verifyToken(req.session.user.token))
            {
                let return_value: boolean = await LockController.registerLock(+req.body.account_id, req.body.lock_name, ipv4, port, req.body.password);

                if(return_value == true)
                {
                    res.redirect("/registerLock");
                }
                else
                {
                    res.sendStatus(501);
                }
            }
            else
            {
                res.sendStatus(501);
            }
        });

        this.ROUTER.post("/new_action", async (req: Request, res: Response) =>
        {
            if(req.session.user != null && await verifyToken(req.session.user.token))
            {
                let return_value: boolean = await LockController.changeInfo(ipv4, port, +req.body.lock_id, undefined, undefined, req.body.new_action);

                console.log(return_value);

                if(return_value == true)
                {
                    res.send("true");
                }
                else
                {
                    res.send("false");
                }
            }
            else
            {
                res.send("false");
            }
        });

        this.ROUTER.post("/refresh_locks", async (req: Request, res: Response) =>
            {
                if(req.session.user != null && await verifyToken(req.session.user.token))
                {
                    let return_value: ILocksInfos[]|null = await LockController.getUserLocks(+req.body.account_id, ipv4, port);
    
                    console.log(return_value);

                    if(return_value != null)
                    {
                        res.send(return_value);
                    }
                    else
                    {
                        res.send(null);
                    }
                }
                else
                {
                    res.send(null);
                }
            });

        //#endregion

        return this.ROUTER;
    }
}