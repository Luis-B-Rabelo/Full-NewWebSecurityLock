import { IInfos, ILocksInfos, IUsers } from "../../Interfaces/ILocks";

export class LockController
{
    public static async registerLock(account_id: number, lock_name: string, ipv4: string, port: string, password?: string): Promise<boolean>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/registerLock`,
        {
            account_id: account_id,
            lock_name: lock_name
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }

    public static async getUser(account_id: number, ipv4: string, port: string): Promise<IUsers|null>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/getUser`,
        {
            account_id: account_id
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }

    public static async getUserLocks(account_id: number, ipv4: string, port: string): Promise<ILocksInfos[]|null>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/getUserLocks`,
        {
            account_id: account_id
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }

    public static async getInfos(ipv4: string, port: string, lock_id: number, state?: boolean, last_action?: boolean, new_action?: boolean): Promise<IInfos[]>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/changeInfo`,
        {
            lock_id: lock_id,
            state: state,
            last_action: last_action,
            new_action: new_action
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }

    public static async changeInfo(ipv4: string, port: string, lock_id: number, state?: boolean, last_action?: boolean, new_action?: boolean): Promise<boolean>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/changeInfo`,
        {
            lock_id: lock_id,
            state: state,
            last_action: last_action,
            new_action: new_action
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }
}