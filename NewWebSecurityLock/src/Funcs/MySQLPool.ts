import fs from "fs/promises";
import mysql, { Pool, PoolOptions } from "mysql2/promise";

export class MySQLPool
{
    public static async openPool(db_config_file_path: string): Promise<Pool|null>
    {
        try
        {
            let db_json = await fs.readFile(db_config_file_path + ".json", "utf-8");
            let db_obj = await JSON.parse(db_json);

            return mysql.createPool(db_obj);
        }
        catch(err: any)
        {
            console.log(`Problem to open pool with database on ${db_config_file_path}, because of error: \n ${err}`);
            return null;
        }
    }  
}