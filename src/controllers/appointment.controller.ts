import { Body, Controller, Delete, Get, Logger, NotImplementedException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateAppointmentDTO } from "src/dto/create-appointment.dto";
import { Appointment } from "src/frameworks/data-services/mysql/entities/appointment.model";
import { AppointmentUseCase } from "src/use-cases/appointments/appointment.use-case";

@ApiTags('Appointments')
@Controller('Appointment')
export class AppointmentController {

    private readonly logger = new Logger(AppointmentController.name);

    constructor(private appointmentUseCase: AppointmentUseCase) {

    }

    @Post()
    createNewAppointment(@Body() appointmentDTO: CreateAppointmentDTO): Promise<Appointment> {
        this.logger.log('createNewAppointment(CreateAppointmentDTO) - Start.');
        return this.appointmentUseCase.createAppointment(appointmentDTO);
    }

    @Get()
    getAllAppointments() {
        this.logger.log('getAllAppointments() - Start.');
        return this.appointmentUseCase.getAll();
    }

    @Get('/doctor/:doctorId')
    getAppointmentsByDoctorId(@Param('doctorId') doctorId: number) {
        this.logger.log('getAppointmentsByDoctorId(string) - Start.');
        return this.appointmentUseCase.getByDoctorId(doctorId);
    }

    @Get('/patient/:patientId')
    getAppointmentsByPatientId(@Param('patientId') patientId: number) {
        this.logger.log('getAppointmentsByPatientId(string) - Start.');
        return this.appointmentUseCase.getByPatientId(patientId);
    }

    @Get('/:appointmentId')
    getAppointment(@Param('appointmentId') appointmentId: number) {
        this.logger.log('getAppointment(number) - Start');
        return this.appointmentUseCase.getAppointmentById(appointmentId);

    }

    @Delete('/:appointmentId')
    deleteAppointment(@Param('appointmentId') appointmentId: number) {
        this.logger.log('deleteAppointment(number) - Start');
        return this.appointmentUseCase.deleteAppointment(appointmentId);

    }

}