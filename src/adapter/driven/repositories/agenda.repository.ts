import { Agenda } from "../../../core/domain/entities/agenda.model";
import { MySqlGenericRepository } from "./mysql-generic-repository";

export class AgendaRepositoryImpl extends MySqlGenericRepository<Agenda> {

    getByDoctorId(id: any): Promise<Agenda[]> {
        return this._repository
            .find({
                where: {
                    doctorId: id
                }
            });
    }

}