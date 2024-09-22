import { Module } from '@nestjs/common';
import { MySqlDataServicesModule } from 'src/frameworks/data-services/mysql/mysql-data-services.module';

@Module({
  imports: [MySqlDataServicesModule],
  exports: [MySqlDataServicesModule],
})
export class DataServicesModule { }