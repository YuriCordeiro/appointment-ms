import { AppointmentRepositoryImpl } from "src/adapter/driven/repositories/appointment.repository";
import { AgendaRepositoryImpl } from "src/adapter/driven/repositories/agenda.repository";

export abstract class IDataServices {
  abstract appointments: AppointmentRepositoryImpl;
  abstract agendas: AgendaRepositoryImpl;
}