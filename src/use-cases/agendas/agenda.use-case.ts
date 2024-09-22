import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { CreateAgendaDTO } from "src/dto/create-agenda.dto";
import { Agenda } from "src/frameworks/data-services/mysql/entities/agenda.model";

@Injectable()
export class AgendaUseCase {

    constructor(private dataServices: IDataServices) { }

    async createAgenda(agendaDTO: CreateAgendaDTO) {

        let receivedDate = new Date(agendaDTO.date);
        let foundDoctorAgendas = await this.getAgendasByDoctorId(agendaDTO.doctorId);
        if (foundDoctorAgendas != null) {
            let existentAgenda = foundDoctorAgendas.find(agenda => agenda.date.getDate() == receivedDate.getDate() && agenda.date.getHours() == receivedDate.getHours());
            if (existentAgenda != null) {
                throw new ConflictException(`There is already an agenda registered with date: ${receivedDate}`);
            }
        }

        let entity: Agenda = new Agenda();
        entity.date = agendaDTO.date;
        entity.doctorId = agendaDTO.doctorId;
        entity.isAvailable = agendaDTO.isAvailable;

        return this.dataServices.agendas.create(entity);
    }

    async getAllAgendas() {
        return this.dataServices.agendas.getAll();
    }

    async getAgendasByDoctorId(doctorId: number) {
        return this.dataServices.agendas.getByDoctorId(doctorId);
    }

    async bookDateAtDoctorAgenda(doctorId: number, appointmentDate: Date) {
        let doctorAgendas = await this.getAgendasByDoctorId(doctorId);
        let receivedDate = new Date(appointmentDate);
        let startDate = receivedDate.getDate();
        let startHour = receivedDate.getHours();
        let foundAvailableAgenda = doctorAgendas.find(agenda => agenda.date.getDate() == startDate && agenda.date.getHours() == startHour);
        if (foundAvailableAgenda != null) {
            foundAvailableAgenda.isAvailable = false;
            return this.dataServices.agendas.update(foundAvailableAgenda.id.toString(), foundAvailableAgenda);
        }
    }

    /**
     * 
     * @param doctorId Find available agendas for doctor
     * @param appointmentStartDate 
     * @returns 
     */
    async doctorHasAvailbeAgenda(doctorId: number, appointmentStartDate: Date): Promise<Agenda[]> {
        const agendas = await this.getAgendasByDoctorId(doctorId);
        let date = new Date(appointmentStartDate)
        let startDate = date.getDate();
        let startHour = date.getHours();
        return agendas
            .filter(agenda => agenda.isAvailable)
            .filter(agenda => agenda.date.getDate() == startDate)
            .filter(agenda => agenda.date.getHours() == startHour);
    }

    async updateAgenda(agenda: CreateAgendaDTO, agendaId: number) {
        let foundAgenda = await this.dataServices.agendas.get(agendaId);

        // Only updates not null fields
        if (foundAgenda != null) {
            if (agenda.date != null) {
                foundAgenda.date = agenda.date;
            }
            if (agenda.doctorId != null) {
                foundAgenda.doctorId = agenda.doctorId;
            }
            if (agenda.isAvailable != null) {
                foundAgenda.isAvailable = agenda.isAvailable;
            }

            return this.dataServices.agendas.update(agendaId.toString(), foundAgenda);
        }

        throw new NotFoundException(`No agenda with ID: ${agendaId} were found.`);
    }

    async deleteAgenda(agendaId: number) {
        return this.dataServices.agendas.delete(agendaId.toString());
    }

    async getAgendaById(agendaId: number) {
        return this.dataServices.agendas.get(agendaId);
    }

}