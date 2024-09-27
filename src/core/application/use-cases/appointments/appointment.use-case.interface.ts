import { CreateAppointmentDTO } from "src/adapter/driver/dtos/create-appointment.dto";
import { DoctorResponseDTO } from "src/adapter/driver/dtos/doctor-response.dto";
import { Agenda } from "src/core/domain/entities/agenda.model";
import { Appointment } from "src/core/domain/entities/appointment.model";

export interface IAppointmentUseCase {
  createAppointment(appointmentDTO: CreateAppointmentDTO, patientName: string): Promise<Appointment> 
  addHours(hours: number, date: Date): Date;
  getAll(): Promise<Appointment[]>;
  getByPatientId(patientId: number): Promise<Appointment[]>;
  getByDoctorId(doctorId: number): Promise<Appointment[]>;
  updateAppointment(appointmentId: number, appointment: CreateAppointmentDTO): Promise<Appointment>;
  getAppointmentById(appointmentId: number): Promise<Appointment>;
  deleteAppointment(appointmentId: number): Promise<Agenda>;
}