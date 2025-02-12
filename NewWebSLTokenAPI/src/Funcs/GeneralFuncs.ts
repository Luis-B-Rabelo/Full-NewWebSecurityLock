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