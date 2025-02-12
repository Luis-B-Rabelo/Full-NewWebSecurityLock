import {Request, Response, Router} from "express";
import { TokenController } from "../Controllers/TokenController";

export class TokenRoutes
{
    private static readonly ROUTER = Router();
    
    public static async setRoutes(): Promise<Router>
    {
        //#region POST routes

        this.ROUTER.post("/createToken", async (req: Request, res: Response) => 
        {
            let token: string|null = await TokenController.createToken(+req.body.account_id);

            console.log(token);
        
            res.send(token);
        });

        this.ROUTER.post("/verifyToken", async (req: Request, res: Response) =>
        {
            let is_token_valid: boolean = await TokenController.verifyToken(req.body.token);

            res.send(is_token_valid);
        });

        //#endregion

        return this.ROUTER;
    }

}