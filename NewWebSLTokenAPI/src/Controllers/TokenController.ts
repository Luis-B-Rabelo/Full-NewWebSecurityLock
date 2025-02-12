import { createToken, verifyToken } from "../Funcs/TokenFuncs";

export class TokenController
{
    public static async createToken(account_id: number): Promise<string|null>
    {
        return await createToken(account_id);
    }

    public static async verifyToken(token: string): Promise<boolean>
    {
        return await verifyToken(token);
    }
}