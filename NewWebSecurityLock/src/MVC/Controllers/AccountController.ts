export class AccountController
{
    public static async registerAccount(email: string, name: string, level: number, password: string, ipv4: string, port: string): Promise<boolean>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/registerAccount`,
        {
            email: email,
            name: name,
            level: level,
            password: password
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }

    public static async loginAccount(email: string, password: string, ipv4: string, port: string): Promise<string>
    {
        let axios = require("axios");

        let return_value = await axios.post(`http://${ipv4}:${port}/loginAccount`,
        {
            email: email,
            password: password
        },
        {
            headers: 
            {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return return_value.data;
    }
}