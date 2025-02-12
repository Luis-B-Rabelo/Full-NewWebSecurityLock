export async function createKey()
{
    let crypto = require("crypto");

    let fs = require("fs/promises");

    let random_string = crypto.randomBytes(32);

    let key = (crypto.createHash("sha256").update(random_string).digest("base64")).substr(0,32);

    let security = await fs.readFile("rsrc/utilities/security.json", "utf-8");

    security = JSON.parse(security);

    security.key = key;

    await fs.writeFile("rsrc/utilities/security.json", JSON.stringify(security), "utf-8");
}

export async function createIV()
{
    let crypto = require("crypto");

    let fs = require("fs/promises");

    let iv = crypto.randomBytes(16);

    let security = await fs.readFile("rsrc/utilities/security.json", "utf-8");

    security = JSON.parse(security);

    security.iv = iv;

    await fs.writeFile("rsrc/utilities/security.json", JSON.stringify(security), "utf-8");
}