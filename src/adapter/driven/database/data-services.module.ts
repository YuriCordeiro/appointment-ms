import { Module } from '@nestjs/common';
import { MySqlDataServicesModule } from 'src/adapter/driven/database/mysql-data-services.module';

@Module({
  imports: [MySqlDataServicesModule],
  exports: [MySqlDataServicesModule],
})
export class DataServicesModule { }