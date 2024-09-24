import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { AgendaController } from './controllers/agenda.controller';
import { AgendaUseCase } from './use-cases/agendas/agenda.use-case';
import { AppointmentUseCase } from './use-cases/appointments/appointment.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from './frameworks/data-services/mysql/entities/agenda.model';
import { Appointment } from './frameworks/data-services/mysql/entities/appointment.model';
import { MySqlDataServicesModule } from './frameworks/data-services/mysql/mysql-data-services.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { IMedPortToken } from './frameworks/api-services/ports/med.port';
import { MedAdapter } from './frameworks/api-services/adapters/med.adapter';
import { HttpModule } from '@nestjs/axios';
import { JWTUtil } from './auth/jtw-util';
import { JwtService } from '@nestjs/jwt';

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
      timezone: "-03:00",
      dateStrings: true
      // logging: true,
    }),
    HttpModule,
    MySqlDataServicesModule,
    AuthModule,
    EmailModule
  ],
  controllers: [AppController, AppointmentController, AgendaController],
  providers: [AppController, AppointmentUseCase, AgendaUseCase, { provide: IMedPortToken, useClass: MedAdapter }, JWTUtil, JwtService],
})
export class AppModule { }
