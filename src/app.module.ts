import { Module } from '@nestjs/common';
import { AppController } from './adapter/driver/controllers/app.controller';
import { AppointmentController } from './adapter/driver/controllers/appointment/appointment.controller';
import { AgendaController } from './adapter/driver/controllers/agenda/agenda.controller';
import { AgendaUseCase } from './core/application/use-cases/agendas/agenda.use-case';
import { AppointmentUseCase } from './core/application/use-cases/appointments/appointment.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from './core/domain/entities/agenda.model';
import { Appointment } from './core/domain/entities/appointment.model';
import { MySqlDataServicesModule } from './adapter/driven/database/mysql-data-services.module';
import { AuthModule } from './adapter/driver/auth/auth.module';
import { EmailModule } from './adapter/driven/email/email.module';
import { IMedPortToken } from './adapter/driven/transport/ports/med.port';
import { MedAdapter } from './adapter/driven/transport/adapters/med.adapter';
import { HttpModule } from '@nestjs/axios';
import { JWTUtil } from './adapter/driver/auth/jtw-util';
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
      synchronize: true,
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
