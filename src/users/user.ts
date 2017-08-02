import { Entity, Column, ColumnOptions, PrimaryColumn } from "typeorm";
import * as Bcrypt from "bcryptjs";

@Entity()
export class User {

    @PrimaryColumn("string") // uuid
    id: string;

    @Column({ type: "string", unique: true })
    email: string;

    @Column("string")
    password: string;

    @Column("string")
    name: string;

    @Column("datetime")
    createdAt: Date;

    hashPassword(password: string): string {
        if (!password) {
            return null;
        }
        return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
    }

    validatePassword(password: string): boolean {
        return Bcrypt.compareSync(password, this.password);
    }
}