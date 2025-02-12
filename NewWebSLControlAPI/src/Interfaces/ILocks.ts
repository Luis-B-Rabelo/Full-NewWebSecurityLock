import { RowDataPacket } from "mysql2/promise";

export interface IUsers extends RowDataPacket
{
    name: string;
    level: number;
}

export interface IInfos extends RowDataPacket
{
    state: boolean;
    last_action: boolean;
    new_action: boolean;
}

export interface ILocks extends RowDataPacket
{
    ID: number;
    name: string;
}

export interface ILocksInfos extends RowDataPacket
{
    ID: number;
    name: string;
    state: boolean;
    last_action: boolean;
    new_action: boolean;
}