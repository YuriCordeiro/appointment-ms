import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentRepositoryImpl } from './gateways/appointment.repository';
import { Appointment } from './entities/appointment.model';
import { Agenda } from './entities/agenda.model';
import { AgendaRepositoryImpl } from './gateways/agenda.repository';

@Injectable()
export class MySqlDataServices implements IDataServices, OnApplicationBootstrap {

  appointments: AppointmentRepositoryImpl;
  agendas: AgendaRepositoryImpl;


  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>
  ) { }

  onApplicationBootstrap() {
    this.appointments = new AppointmentRepositoryImpl(this.appointmentRepository);
    this.agendas = new AgendaRepositoryImpl(this.agendaRepository);
  }
}
