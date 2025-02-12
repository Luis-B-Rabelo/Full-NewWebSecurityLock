import { AccountModel } from "../Models/AccountModel";

export class AccountController
{
    public static async registerAccount(email: string, name: string, level: number, password: string): Promise<boolean>
    {
        let crypto = require("crypto");

        password = crypto.createHash("sha256").update(password).digest("hex");

        password = crypto.createHash("sha512").update(password).digest("hex");

        password = crypto.createHash("sha1").update(password).digest("hex");

        let return_value: boolean = await AccountModel.registerAccount(email, name, level, password);

        return return_value;
    }

    public static async loginAccount(email: string, password: string, ipv4: string, port: string): Promise<string>
    {
        let crypto = require("crypto");

        password = crypto.createHash("sha256").update(password).digest("hex");

        password = crypto.createHash("sha512").update(password).digest("hex");

        password = crypto.createHash("sha1").update(password).digest("hex");

        let account_id: number = await AccountModel.loginAccount(email, password);

        let return_value: any;

        if(account_id != 0)
        {
            let axios = require("axios");

            let return_value = await axios.post(`http://${ipv4}:${port}/createToken`,
            {
                account_id: account_id
            },
            {
                headers:
                {"Content-Type": "application/x-www-form-urlencoded"}
            });

            return return_value.data;
        }

        return return_value.data;
    }

    public static async changePassword(id: number, old_number: string, new_password: string): Promise<boolean>
    {
        let return_value: boolean = await AccountModel.changePassword(id, old_number, new_password);

        return return_value;
    }

    public static async changeUsername(id: number, new_name: string): Promise<boolean>
    {
        let return_value: boolean = await AccountModel.changeUsername(id, new_name);

        return return_value;
    }
}