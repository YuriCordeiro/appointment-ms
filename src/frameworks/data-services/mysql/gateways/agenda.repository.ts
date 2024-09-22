import { Agenda } from "../entities/agenda.model";
import { MySqlGenericRepository } from "../external/mysql-generic-repository";

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