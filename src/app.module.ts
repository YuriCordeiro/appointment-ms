import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { AgendaController } from './controllers/agenda.controller';
import { AgendaUseCase } from './use-cases/agendas/agenda.use-case';
import { AppointmentUseCase } from './use-cases/appointments/appointment.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from './frameworks/data-services/mysql/entities/agenda.model';
import { Appointment } from './frameworks/data-services/mysql/entities/appointment.model';
import { MySqlDataServicesModule } from './frameworks/data-services/mysql/mysql-data-services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Agenda, Appointment],
      database: process.env.DB_NAME,
      synchronize: false,
      // logging: true,
    }),
    MySqlDataServicesModule
  ],
  controllers: [AppController, AppointmentController, AgendaController],
  providers: [AppController, AppointmentUseCase, AgendaUseCase],
})
export class AppModule { }
