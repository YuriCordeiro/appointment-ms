import { Body, Controller, Delete, Get, Headers, Logger, NotImplementedException, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Roles } from "src/adapter/driver/auth/decorator-roles";
import { JWTUtil } from "src/adapter/driver/auth/jtw-util";
import { JwtAuthGuard } from "src/adapter/driver/auth/jwt-auth.guard";
import { RolesGuard } from "src/adapter/driver/auth/roles-guard";
import { CreateAppointmentDTO } from "src/adapter/driver/dtos/create-appointment.dto";
import { Appointment } from "src/core/domain/entities/appointment.model";
import { AppointmentUseCase } from "src/core/application/use-cases/appointments/appointment.use-case";
import { Timestamp } from "typeorm";

@ApiBearerAuth()
@ApiTags('Appointments')
@Controller('appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {

    private readonly logger = new Logger(AppointmentController.name);

    constructor(private appointmentUseCase: AppointmentUseCase, private jwtUtil: JWTUtil) { }

    @Post()
    @Roles('patient')
    createNewAppointment(@Body() appointmentDTO: CreateAppointmentDTO, @Req() request: Request): Promise<Appointment> {
        this.logger.log('createNewAppointment(CreateAppointmentDTO) - Start.');
        const jwt = request.headers.authorization;
        const json = this.jwtUtil.decode(jwt) as { sub: number, role: string, name: string, iat: Timestamp, exp: Timestamp };
        const patientName = json.name;
        return this.appointmentUseCase.createAppointment(appointmentDTO, patientName);
    }

    @Get()
    @Roles('patient')
    getAllAppointments() {
        this.logger.log('getAllAppointments() - Start.');
        return this.appointmentUseCase.getAll();
    }

    @Roles('doctor')
    @Get('/doctor/:doctorId')
    getAppointmentsByDoctorId(@Param('doctorId') doctorId: number) {
        this.logger.log('getAppointmentsByDoctorId(string) - Start.');
        return this.appointmentUseCase.getByDoctorId(doctorId);
    }

    @Roles('patient')
    @Get('/patient/:patientId')
    getAppointmentsByPatientId(@Param('patientId') patientId: number) {
        this.logger.log('getAppointmentsByPatientId(string) - Start.');
        return this.appointmentUseCase.getByPatientId(patientId);
    }

    @Roles('patient', 'doctor')
    @Get('/:appointmentId')
    getAppointment(@Param('appointmentId') appointmentId: number) {
        this.logger.log('getAppointment(number) - Start');
        return this.appointmentUseCase.getAppointmentById(appointmentId);

    }

    @Roles('patient')
    @Delete('/:appointmentId')
    deleteAppointment(@Param('appointmentId') appointmentId: number) {
        this.logger.log('deleteAppointment(number) - Start');
        return this.appointmentUseCase.deleteAppointment(appointmentId);

    }

}