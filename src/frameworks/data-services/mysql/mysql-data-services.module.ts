import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { MySqlDataServices } from './mysql-data-services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.model';
import { Agenda } from './entities/agenda.model';

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