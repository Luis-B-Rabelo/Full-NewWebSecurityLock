import { FieldPacket, Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { MySQLPool } from "../../Funcs/MySQLPool";
import { IInfos, ILocksInfos, IUsers } from "../../Interfaces/ILocks";

export class LockModel
{
    public static async registerLock(account_id: number, lock_name: string): Promise<boolean>
    {
        let return_value: boolean = false;

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");

        if(pool_main != null)
        {
            try
            {                
                //#region Varibles for queries

                let insert_lock: string = "INSERT INTO `webslmaindb`.`locks` (`name`, `user_ID_FK`) VALUES (?, ?);";

                let values_insert_lock: any[] = [lock_name, account_id];
        
                let results: [ResultSetHeader, FieldPacket[]];
        
                //#endregion

                results = await pool_main.execute<ResultSetHeader>(insert_lock, values_insert_lock);

                if(results[0].insertId != 0)
                {
                    return_value = true;
                }
            }
            catch(err: any)
            {
                console.log(`Problem to register lock, because of error: \n ${err}`);
            }
            finally 
            {
                await pool_main.end();
            }
        }

        return return_value;
    }

    public static async getUser(account_id: number): Promise<IUsers|null>
    {
        let return_value: IUsers|null = null;

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");

        if(pool_main != null)
        {
            try
            {   
                let result: [IUsers[], FieldPacket[]];

                //#region Variables for query

                let select_locks_infos = "SELECT `name`, `level` FROM `users` WHERE `ID` = ? LIMIT 1;";

                //#endregion

                result = await pool_main.query<IUsers[]>(select_locks_infos, [account_id]);

                if(result[0][0].name != null)
                {
                    return_value = result[0][0];

                    console.log(return_value);
                }
            }
            catch(err: any)
            {
                console.log(`Problem to get user, because of error: \n ${err}`);
            }
            finally 
            {
                await pool_main.end();
            }
        }

        return return_value;
    }

    public static async getUserLocks(account_id: number): Promise<ILocksInfos[]|null>
    {
        let return_value: ILocksInfos[]|null = null;

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");

        if(pool_main != null)
        {
            try
            {   
                let result: [ILocksInfos[], FieldPacket[]];

                //#region Variables for query

                let select_locks_infos = "SELECT `ID`, `name`, `state`, `last_action`, `new_action` FROM `locks` INNER JOIN `infos` ON `ID` = `lock_ID_FK` WHERE `user_ID_FK` = ?;";

                //#endregion

                result = await pool_main.query<ILocksInfos[]>(select_locks_infos, [account_id]);

                if(result[0][0].ID != null)
                {
                    return_value = result[0];
                }
            }
            catch(err: any)
            {
                console.log(`Problem to get locks and infos, because of error: \n ${err}`);
            }
            finally 
            {
                await pool_main.end();
            }
        }

        return return_value;
    }

    public static async getInfo(lock_id: number): Promise<IInfos|null>
    {
        let return_value: IInfos|null = null;

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");

        if(pool_main != null)
        {
            try
            {   
                let result: [IInfos[], FieldPacket[]];

                //#region Variables for query

                let select_info = "SELECT `state`, `last_action`, `new_action` FROM `infos` WHERE `lock_ID_FK` = ? LIMIT 1;";

                //#endregion

                result = await pool_main.query<IInfos[]>(select_info, [lock_id]);

                if(result[0][0].state != null)
                {
                    return_value = result[0][0];
                }
            }
            catch(err: any)
            {
                console.log(`Problem to get lock info, because of error: \n ${err}`);
            }
            finally 
            {
                await pool_main.end();
            }
        }

        return return_value;
    }

    public static async changeInfo(lock_id: number, state?: boolean, last_action?: boolean, new_action?: boolean): Promise<boolean>
    {
        let return_value: boolean = false;

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");

        if(pool_main != null)
        {
            try
            {                
                //#region Varibles for queries

                let changes: string = "";

                if(state != null)
                {
                    changes += `\`state\` = ${state}`;
                }

                if(last_action != null)
                {
                    if(changes != "")
                    {
                        changes += ", ";
                    }

                    changes += `\`last_action\` = ${last_action}`;
                }

                if(new_action != null)
                {
                    if(changes != "")
                    {
                        changes += ", ";
                    }

                    changes += `\`new_action\` = ${new_action}`;
                }

                console.log(changes);

                console.log(lock_id);

                let update_info: string = `UPDATE \`webslmaindb\`.\`infos\` SET ${changes} WHERE \`lock_ID_FK\` = ? LIMIT 1;`;
        
                let results: [ResultSetHeader, FieldPacket[]];
        
                //#endregion

                results = await pool_main.execute<ResultSetHeader>(update_info, [lock_id]);

                if(results[0].affectedRows != 0)
                {
                    return_value = true;
                }
            }
            catch(err: any)
            {
                console.log(`Problem to update lock info, because of error: \n ${err}`);
            }
            finally 
            {
                await pool_main.end();
            }
        }

        return return_value;
    }
}