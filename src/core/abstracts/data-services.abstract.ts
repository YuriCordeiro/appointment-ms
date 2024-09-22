import { AppointmentRepositoryImpl } from "src/frameworks/data-services/mysql/gateways/appointment.repository";
import { AgendaRepositoryImpl } from "src/frameworks/data-services/mysql/gateways/agenda.repository";

export abstract class IDataServices {
  abstract appointments: AppointmentRepositoryImpl;
  abstract agendas: AgendaRepositoryImpl;
}