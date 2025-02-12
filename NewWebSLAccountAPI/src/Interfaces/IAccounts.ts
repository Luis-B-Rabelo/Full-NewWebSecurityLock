import { RowDataPacket } from "mysql2";

export interface IEmails extends RowDataPacket
{
    id: number;
    email: string;
}

export interface IPasswords extends RowDataPacket
{
    id: number;
    password: string;
}