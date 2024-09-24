import { Injectable } from "@nestjs/common";
import { Appointment } from "../../../core/domain/entities/appointment.model";
import { MySqlGenericRepository } from "./mysql-generic-repository";

@Injectable()
export class AppointmentRepositoryImpl extends MySqlGenericRepository<Appointment> {

    getByDoctorId(id: any): Promise<Appointment[]> {
        return this._repository
            .find({
                where: {
                    doctorId: id
                }
            });
    }

    getByPatientId(id: any): Promise<Appointment[]> {
        return this._repository
            .find({
                where: {
                    patientId: id
                }
            });
    }

}