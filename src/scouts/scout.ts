import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Scout implements IScout {

    @PrimaryColumn("string") // uuid
    id: string;

    @Column("string")
    name: string;

    @Column("string")
    rank: string;

    @Column("datetime")
    createdAt: Date;
}

export interface IScout {
    id: string;
    name: string;
    rank: string;
    createdAt: Date;
}