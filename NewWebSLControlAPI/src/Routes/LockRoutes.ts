import {Request, Response, Router} from "express";
import { LockController } from "../MC/Controllers/LockController";
import { IInfos, ILocksInfos, IUsers } from "../Interfaces/ILocks";

export class LockRoutes
{
    private static readonly ROUTER = Router();
    
    public static async setRoutes(): Promise<Router>
    {
        //#region POST routes

        this.ROUTER.post("/registerLock", async (req: Request, res: Response) => 
        {
            let got_registerd: boolean = await LockController.registerLock(+req.body.account_id, req.body.lock_name);
        
            res.send(got_registerd);
        });

        this.ROUTER.post("/getUser", async (req: Request, res: Response) => 
        {
            let selected_user: IUsers|null = await LockController.getUser(+req.body.account_id);
        
            res.send(selected_user);
        });

        this.ROUTER.post("/getUserLocks", async (req: Request, res: Response) => 
            {
                let selected_user_locks: ILocksInfos[]|null = await LockController.getUserLocks(+req.body.account_id);
            
                res.send(selected_user_locks);
            });

        this.ROUTER.post("/changeInfo", async (req: Request, res: Response) =>
        {
            let info_changed: boolean = await LockController.changeInfo(+req.body.lock_id, req.body.state, req.body.last_action, req.body.new_action);

            console.log(info_changed);

            res.send(info_changed);
        });

        this.ROUTER.post("/state", async (req: Request, res: Response) =>
        {
            let info_changed: boolean = await LockController.changeInfo(+req.body.lock_id, req.body.state);

            if(info_changed)
            {
                res.sendStatus(200);
            }
            else
            {
                res.sendStatus(500);
            }
        });

        this.ROUTER.post("/action", async (req: Request, res: Response) =>
        {
            let info_changed: boolean = await LockController.getAction(+req.body.lock_id);

            if(info_changed)
            {
                res.sendStatus(200);
            }
            else
            {
                res.sendStatus(500);
            }
        });

        //#endregion

        return this.ROUTER;
    }

}