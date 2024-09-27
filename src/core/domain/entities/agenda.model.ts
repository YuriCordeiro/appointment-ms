import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Agenda {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    doctorId: number;
    @Column({ type: Date })
    date: Date;
    @Column()
    isAvailable: boolean;
}