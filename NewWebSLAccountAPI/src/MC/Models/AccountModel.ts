import { PoolConnection, FieldPacket, Pool, ResultSetHeader } from "mysql2/promise";
import { MySQLPool } from "../../Funcs/MySQLPool";
import { generateRandomNumber, HUPairingFunction } from "../../Funcs/AccountFuncs";
import { IEmails, IPasswords } from "../../Interfaces/IAccounts";

export class AccountModel
{
    public static async registerAccount(email: string, name:string, level:number, password:string): Promise<boolean>
    {
        let return_value: boolean = false;

        let pool_account: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLAccountDB");

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");


        if(pool_account != null && pool_main != null)
        {
            let conn_account: PoolConnection = await pool_account.getConnection();

            let conn_main: PoolConnection = await pool_main.getConnection();

            try
            {                
                //#region Varibles for queries

                let insert_email: string = "INSERT INTO `webslaccountdb`.`emails` (`ID`, `email`) VALUES (?, ?);";
        
                let insert_password: string = "INSERT INTO `webslaccountdb`.`passwords` (`ID`, `password`) VALUES (?, ?);"
        
                let insert_user: string = "INSERT INTO `webslmaindb`.`users` (`ID`, `name`, `level`) VALUES (?, ?, ?);";
        
                let results: [ResultSetHeader, FieldPacket[]];
        
                //#endregion

                await conn_account.beginTransaction();

                let fs = require("fs/promises");
                
                let db_utility_file = await fs.readFile("./rsrc/utility-files/db-utility.json", "utf-8");

                db_utility_file = await JSON.parse(db_utility_file);

                let account_id: number = ++(db_utility_file.last_inserted_id);

                let values_insert_email: any[] = [account_id, email];

                results = await conn_account.execute<ResultSetHeader>(insert_email, values_insert_email);

                console.log("Email insert completed");

                let values_insert_user: any[] = [account_id, name, level];

                let rand_num: number = generateRandomNumber();

                let composed_id = HUPairingFunction(account_id, rand_num);

                let values_insert_password: any[] = [composed_id, password];

                results = await conn_account.execute<ResultSetHeader>(insert_password, values_insert_password);

                console.log("Password insert completed");

                conn_main.beginTransaction();

                results = await conn_main.execute<ResultSetHeader>(insert_user, values_insert_user);

                console.log("User insert completed");

                db_utility_file.random_numbers.push(rand_num);

                await fs.writeFile("./rsrc/utility-files/db-utility.json", JSON.stringify(db_utility_file), "utf-8");

                await conn_account.commit();

                await conn_main.commit();

                return_value = true;
            }
            catch(err: any)
            {
                console.log(`Problem to register user, because of error: \n ${err}`);

                await conn_account.rollback();

                await conn_main.rollback();
            }
            finally 
            {
                conn_account.release();

                conn_main.release();

                await pool_account.end();

                await pool_main.end();
            }
        }

        return return_value;
    }

    public static async loginAccount(email: string, password: string): Promise<number>
    {
        let return_value: number = 0;

        let pool_account: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLAccountDB");

        if(pool_account != null)
        {
            let conn_account: PoolConnection = await pool_account.getConnection();

            try
            {
                //#region Variables for queries

                let select_email: string = "SELECT `ID` FROM `emails` WHERE `email` = ?;"

                let values_select_email: any[] = [email];

                let select_password: string = "SELECT EXISTS (SELECT * FROM `passwords` WHERE `ID` = ? AND `password` = ? LIMIT 1) AS `password_exists`;"


                let results: [IEmails[], FieldPacket[]]|[IPasswords[], FieldPacket[]];

                //#endregion

                results = await conn_account.query<IEmails[]>(select_email, values_select_email);

                console.log("Email select completed");

                let account_id: number = results[0][0].ID;

                if(account_id == 0)
                {    
                    console.log("Email not registered");
                    throw Error;
                }

                let fs = require("fs/promises");

                let db_utility_file = await fs.readFile("./rsrc/utility-files/db-utility.json", "utf-8");

                db_utility_file = await JSON.parse(db_utility_file);

                let rand_num: number = db_utility_file.random_numbers[account_id];

                let composed_id = HUPairingFunction(account_id, rand_num);

                let values_select_password: any[] = [composed_id, password];

                results = await conn_account.query<IPasswords[]>(select_password, values_select_password);

                console.log("Password select completed");

                if(results[0][0].password_exists == 1)
                {
                    return_value = account_id;
                }
            }
            catch (err: any)
            {
                console.log(`Problem to login user, because of error: \n ${err}`);
            }
            finally
            {
                conn_account.release();

                pool_account.end();
            }
        }

        return return_value;
    }

    public static async changePassword(account_id: number, old_password: string, new_password: string): Promise<boolean>
    {
        let return_value: boolean = false;

        let pool_account: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLAccountDB");

        if(pool_account != null)
        {
            try
            {
                //#region Variables for queries

                let update_password: string = "UPDATE `passwords` SET `password` = ? WHERE `ID` = ? AND `password` = ? LIMIT 1;"

                let results: [ResultSetHeader, FieldPacket[]];

                //#endregion

                let fs = require("fs/promises");

                let db_utility_file = await fs.readFile("./rsrc/utility-files/db-utility.json", "utf-8");

                db_utility_file = await JSON.parse(db_utility_file);

                let composed_id = HUPairingFunction(account_id, db_utility_file.random_numbers[account_id]);

                let values_update_password = [new_password, composed_id, old_password];

                results = await pool_account.execute<ResultSetHeader>(update_password, values_update_password);

                if(results[0].affectedRows == 1)
                {
                    return_value = true;
                }
            }
            catch (err: any)
            {
                console.log(`Problem to update account password, because of error: \n ${err}`);
            }
            finally
            {
                pool_account.end();
            }
        }

        return return_value;
    }

    public static async changeUsername(account_id: number, new_name: string): Promise<boolean>
    {
        let return_value: boolean = false;

        let pool_main: Pool|null = await MySQLPool.openPool("./rsrc/dbconfig/WebSLMainDB");

        if(pool_main != null)
        {
            try
            {
                //#region Variables for queries

                let update_username: string = "UPDATE `users` SET `name` = ? WHERE `ID` = ? LIMIT 1;"

                let results: [ResultSetHeader, FieldPacket[]];

                //#endregion

                let values_update_username = [new_name, account_id];

                results = await pool_main.execute<ResultSetHeader>(update_username, values_update_username);

                if(results[0].affectedRows == 1)
                {
                    return_value = true;
                }
            }
            catch (err: any)
            {
                console.log(`Problem to update user name, because of error: \n ${err}`);
            }
            finally
            {
                pool_main.end();
            }
        }

        return return_value;
    }
}