import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointment {

    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    doctorId: number;
    @Column()
    patientId: number;
    @Column({ type: Date })
    startDate: Date;
    @Column({ type: Date })
    endDate: Date;
    @Column({ default: 'scheduled' })
    status: string;
}