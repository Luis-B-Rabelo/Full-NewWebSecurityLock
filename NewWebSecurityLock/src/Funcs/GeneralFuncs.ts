import * as os from 'os';

export function getLocalIPAddress() 
{
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName of Object.keys(networkInterfaces)) 
    {
        const networkInterface = networkInterfaces[interfaceName];
        if (networkInterface) 
        {
            for (const net of networkInterface) 
                {
                if (net.family === 'IPv4' && !net.internal) 
                {
                    return net.address;
                }
            }
        }
    }
    return null;
}

export async function verifyToken(token: string): Promise<boolean>
{
    let axios = require("axios");

    let return_value = await axios.post(`http://${getLocalIPAddress()}:3003/verifyToken`,
    {
        token: token
    },
    {
        headers: 
        {"Content-Type": "application/x-www-form-urlencoded"}
    });

    return return_value.data;    
}