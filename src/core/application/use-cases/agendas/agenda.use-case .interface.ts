import { CreateAgendaDTO } from "src/adapter/driver/dtos/create-agenda.dto";
import { Agenda } from "src/core/domain/entities/agenda.model";

export interface IAgendaUseCase {
    createAgenda(agendaDTO: CreateAgendaDTO, loggedDoctorId: number): Promise<Agenda>;
    getAllAgendas(): Promise<Agenda[]>;
    getAgendasByDoctorId(doctorId: number): Promise<Agenda[]>;
    bookDateAtDoctorAgenda(doctorId: number, appointmentDate: Date): Promise<Agenda>;
    doctorHasAvailbeAgenda(doctorId: number, appointmentStartDate: Date): Promise<Agenda[]>;
    updateAgenda(agenda: CreateAgendaDTO, agendaId: number): Promise<Agenda>;
    deleteAgenda(agendaId: number): Promise<void>;
    getAgendaById(agendaId: number): Promise<Agenda>;
}
