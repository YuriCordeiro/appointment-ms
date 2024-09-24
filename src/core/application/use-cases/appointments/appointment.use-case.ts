import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/domain/repositories/data-services.abstract";
import { CreateAppointmentDTO } from "src/adapter/driver/dtos/create-appointment.dto";
import { Appointment } from "src/core/domain/entities/appointment.model";
import { AgendaUseCase } from "../agendas/agenda.use-case";
import { EmailService } from "src/adapter/driver/email/email.service";
import { IMedPort, IMedPortToken } from "src/adapter/driven/transport/ports/med.port";
import { DoctorResponseDTO } from "src/adapter/driver/dtos/doctor-response.dto";

@Injectable()
export class AppointmentUseCase {

    private readonly logger = new Logger(AppointmentUseCase.name);

    constructor(
        private dataServices: IDataServices,
        private agendaUseCase: AgendaUseCase,
        private emailService: EmailService,
        @Inject(IMedPortToken) private doctorMicrosserviceClient: IMedPort
    ) { }

    async createAppointment(appointmentDTO: CreateAppointmentDTO, patientName: string): Promise<Appointment> {

        const doctorId = appointmentDTO.doctorId;
        const appointmentStartDate = appointmentDTO.startDate;
        const doctorAvailableAgendas = await this.agendaUseCase.doctorHasAvailbeAgenda(doctorId, appointmentStartDate);
        const doctorHasAppointmentConflicts = await this.doctorHasAppointmentConflicts(doctorId, appointmentStartDate)

        if (doctorAvailableAgendas.length > 0) {
            if (!doctorHasAppointmentConflicts) {
                let appointment: Appointment = this.mapNewAppointment(appointmentDTO);

                this.logger.log(`Appointment start date: ${new Date(appointment.startDate)}`);
                this.logger.log(`Appointment end date: ${appointment.endDate}`);

                let createdAppointment = this.dataServices.appointments.create(appointment);
                await this.agendaUseCase.bookDateAtDoctorAgenda(doctorId, appointment.startDate);

                this.sendEmail(appointmentDTO, doctorId, patientName);
                return createdAppointment;
            } else {
                throw new ConflictException(`Doctor with ID: ${doctorId} has not agendas available at requested date: ${appointmentStartDate}. Please choose another date!`);
            }
        } else {
            throw new NotFoundException(`Doctor with ID: ${doctorId} has not agendas available at requested date: ${appointmentStartDate}`);
        }
    }

    private async sendEmail(appointment: CreateAppointmentDTO, doctorId: number, patientName: string) {
        const utcDate = this.addHours(3, appointment.startDate); // Solve deserializing date problem
        const formattedDate = utcDate.toLocaleDateString("pt-BR", {
            year: 'numeric',
            month: ('long'),
            weekday: ('long'),
            day: 'numeric',
        });
        const formattedTime = utcDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
        const doctorInformation = await this.getDoctorInformationExternally(doctorId);
        const doctorEmail = doctorInformation.email;
        const doctorName = doctorInformation.name;
        const emailSubject = "Agendamento de Consulta Realizado";
        const emailBodyMessage =
            `Olá, Dr. ${doctorName}! 

        Você tem uma nova consulta marcada!
        Paciente: ${patientName}.
        Data e horário: ${formattedDate} às ${formattedTime} horas.`

        this.emailService.sendEmail(doctorEmail, emailSubject, emailBodyMessage);
    }

    private async getDoctorInformationExternally(doctorId: number): Promise<DoctorResponseDTO> {
        const response = await this.doctorMicrosserviceClient.getDoctorById(doctorId.toString());
        const doctorInformation = response.data as DoctorResponseDTO;

        return doctorInformation;
    }

    private mapNewAppointment(appointmentDTO: CreateAppointmentDTO) {
        let appointment: Appointment = new Appointment();
        appointment.doctorId = appointmentDTO.doctorId;
        appointment.patientId = appointmentDTO.patientId;
        appointment.startDate = new Date(appointmentDTO.startDate);
        appointment.endDate = this.addHours(1, new Date(appointmentDTO.startDate)); // Set end date to startDate + 1 hour
        appointment.status = appointmentDTO.status;

        return appointment;
    }

    private async doctorHasAppointmentConflicts(doctorId: number, appointmentStartDate: Date): Promise<boolean> {
        let doctorAppointments = await this.getByDoctorId(doctorId);
        if (doctorAppointments.length === 0) {
            return false; // There is no appointments for the requested doctor
        }
        let receivedDate = new Date(appointmentStartDate);
        let conflictAppointments: Appointment[] = doctorAppointments
            .filter(item => item.startDate.getDate() == receivedDate.getDate())
            .filter(item => item.startDate.getHours() == receivedDate.getHours())
            .filter(item => item.status == "scheduled");

        return conflictAppointments.length > 0;
    }

    addHours(hours: number, date: Date) {
        if (typeof hours !== 'number') {
            throw new Error('Invalid "hours" argument')
        }

        if (!(date instanceof Date)) {
            throw new Error('Invalid "date" argument')
        }

        date.setHours(date.getHours() + hours)

        return date
    }

    async getAll(): Promise<Appointment[]> {
        return this.dataServices.appointments.getAll();
    }

    async getByPatientId(patientId: number) {
        return this.dataServices.appointments.getByPatientId(patientId);
    }

    async getByDoctorId(doctorId: number) {
        return this.dataServices.appointments.getByDoctorId(doctorId);
    }

    async updateAppointment(appointmentId: number, appointment: CreateAppointmentDTO) {
        let foundAppointment = await this.dataServices.appointments.get(appointmentId);

        if (foundAppointment != null) {

            if (appointment.startDate != null) {
                foundAppointment.startDate = appointment.startDate;
                foundAppointment.endDate = this.addHours(1, appointment.startDate)
            }

            if (appointment.doctorId != null) {
                foundAppointment.doctorId = appointment.doctorId;
            }

            if (appointment.patientId != null) {
                foundAppointment.patientId = appointment.patientId;
            }

            if (appointment.status != null) {
                foundAppointment.status = appointment.status;
            }

            return this.dataServices.appointments.update(appointmentId.toString(), foundAppointment);

        }

        throw new NotFoundException(`No appointment with id: ${appointmentId} were found.`);
    }

    async getAppointmentById(appointmentId: number) {
        return this.dataServices.appointments.get(appointmentId);
    }

    async deleteAppointment(appointmentId: number) {
        let foundAppointment = await this.getAppointmentById(appointmentId);
        if (foundAppointment != null) {
            let date = new Date(foundAppointment.startDate);
            let agendaDate = date.getDate();
            let agendaHours = date.getHours();
            let doctorAgendas = await this.agendaUseCase.getAgendasByDoctorId(foundAppointment.doctorId);
            let foundBookedAgenda = doctorAgendas.filter(agenda => !agenda.isAvailable).find(agenda => agenda.date.getDate() == agendaDate && agenda.date.getHours() == agendaHours);
            if (foundBookedAgenda != null) {
                let agendaId = foundBookedAgenda.id;
                foundAppointment.status = 'cancelled'
                foundBookedAgenda.isAvailable = true;
                return this.dataServices.appointments
                    .update(foundAppointment.id.toString(), foundAppointment) // set appointment status to cancelled
                    .then(() => this.agendaUseCase.updateAgenda(foundBookedAgenda, agendaId)); // set agenda isAvailable to TRUE
            }
        } else {
            throw new NotFoundException(`There is no appointment with ID: ${appointmentId} registered.`);
        }
    }
}