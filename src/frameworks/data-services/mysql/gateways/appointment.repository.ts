import { Appointment } from "../entities/appointment.model";
import { MySqlGenericRepository } from "../external/mysql-generic-repository";

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