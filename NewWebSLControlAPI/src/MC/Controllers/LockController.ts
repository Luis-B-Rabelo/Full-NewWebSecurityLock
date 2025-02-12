import { IInfos, ILocksInfos, IUsers } from "../../Interfaces/ILocks";
import { LockModel } from "../Models/LockModel";

export class LockController
{
    public static async registerLock(account_id: number, lock_name: string): Promise<boolean>
    {
        return await LockModel.registerLock(account_id, lock_name);
    }

    public static async getUser(account_id: number): Promise<IUsers|null>
    {
        return await LockModel.getUser(account_id);
    }

    public static async getUserLocks(account_id: number): Promise<ILocksInfos[]|null>
    {
        return await LockModel.getUserLocks(account_id);
    }

    public static async getInfo(lock_id: number): Promise<IInfos|null>
    {
        let info: IInfos|null = await LockModel.getInfo(lock_id);

        let return_value: boolean = false;

        return info;
    }

    public static async getAction(lock_id: number): Promise<boolean>
    {
        let info: IInfos|null = await LockModel.getInfo(lock_id);

        let return_value: boolean = false;

        if(info != null)
        {
            if(info.last_action != info.new_action && info.state == true)
            {
                info.last_action = info.new_action;

                if(await LockModel.changeInfo(lock_id, undefined, info.last_action))
                {
                    return_value = true;
                }
            }
        }

        return return_value;
    }

    public static async changeInfo(lock_id: number, state?: boolean, last_action?: boolean, new_action?: boolean): Promise<boolean>
    {
        return await LockModel.changeInfo(lock_id, state, last_action, new_action);
    }
}