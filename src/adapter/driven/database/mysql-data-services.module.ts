import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { MySqlDataServices } from '../../../adapter/driven/repositories/mysql-data-services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../../core/domain/entities/appointment.model';
import { Agenda } from '../../../core/domain/entities/agenda.model';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Appointment, Agenda])
    ],
    providers: [
        {
            provide: IDataServices,
            useClass: MySqlDataServices,
        }
    ],
    exports: [IDataServices],
})
export class MySqlDataServicesModule { }