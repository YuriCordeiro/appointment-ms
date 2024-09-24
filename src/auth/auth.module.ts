import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MySqlDataServicesModule } from 'src/frameworks/data-services/mysql/mysql-data-services.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '60m' },
    }),
    MySqlDataServicesModule,
  ],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule { }
