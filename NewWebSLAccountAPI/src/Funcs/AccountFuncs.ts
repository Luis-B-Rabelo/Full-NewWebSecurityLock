export function generateRandomNumber(): number
{
    return Math.floor(Math.random() * (128 - 1 + 1) ) + 1;
}

export function HUPairingFunction(id: number, rand_num: number): number
{
    return (0.5) * (id + rand_num) * (id + rand_num + 1) + rand_num;
}