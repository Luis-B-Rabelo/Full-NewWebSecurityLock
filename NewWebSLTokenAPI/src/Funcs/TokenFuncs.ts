export async function createToken(id:number): Promise<string|null>
{
    if(id != 0)
    {
        try
        {
            let crypto = require("crypto");

            let fs = require("fs/promises");

            let security = await fs.readFile("rsrc/utilities/security.json", "utf-8");

            security = JSON.parse(security);

            let key: string = security.key;

            let iv: Buffer|Int8Array = security.iv.data;

            iv = Buffer.from(iv);

            let token: string;

            let cipher = crypto.createCipheriv("aes-256-ctr", key, iv);

            token = id + new Date().toDateString();

            let encrypted = cipher.update(token);

            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return encrypted.toString("hex") + ":" + id;
        }
        catch(err: any)
        {
            console.log(`Problem to create token, because of error: \n ${err}`)
        }
    }

    return null;
}

export async function verifyToken(token: string): Promise<boolean>
{
    let crypto = require("crypto");

    let fs = require("fs/promises");

    let token_parts = token.split(":", 2);

    let security = await fs.readFile("rsrc/utilities/security.json", "utf-8");

    security = JSON.parse(security);

    let key: string = security.key;

    let iv: Buffer|Int8Array = security.iv.data;

    iv = Buffer.from(iv);

    let encrypted_text = Buffer.from(token_parts[0], "hex");

    let id: number = +token_parts[1];

    let decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);

    let decrypted = decipher.update(encrypted_text);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    if(decrypted == (id + new Date().toDateString()))
    {
        return true;
    }

    return false;
}