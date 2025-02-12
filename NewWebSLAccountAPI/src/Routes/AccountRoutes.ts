import {Request, Response, Router} from "express";
import { AccountController } from "../MC/Controllers/AccountController";

export class AccountRoutes
{
    private static readonly ROUTER = Router();
    
    public static async setRoutes(ipv4: string, port: string): Promise<Router>
    {
        this.ROUTER.post("/registerAccount", async (req: Request, res: Response) =>
        {
            let got_registerd: boolean = await AccountController.registerAccount(req.body.email, req.body.name, +req.body.level, req.body.password);
        
            res.send(got_registerd);
        });

        this.ROUTER.post("/loginAccount", async (req: Request, res: Response) =>
        {
            let token: string = await AccountController.loginAccount(req.body.email, req.body.password, ipv4, port);
        
            res.send(token);
        });
        
        this.ROUTER.post("/changePassword", async (req: Request, res: Response) =>
        {
            let password_changed: boolean = await AccountController.changePassword(req.body.id, req.body.old_password, req.body.new_password);
        
            res.send(password_changed);
        });
        
        this.ROUTER.post("/changeUsername", async (req: Request, res: Response) =>
        {
            let name_changed: boolean = await AccountController.changeUsername(req.body.id, req.body.new_name);
        
            res.send(name_changed   );
        });

        return this.ROUTER;
    }

}