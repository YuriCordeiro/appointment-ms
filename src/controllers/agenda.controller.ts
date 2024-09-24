import { Body, Controller, Delete, Get, Logger, NotImplementedException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/auth/decorator-roles";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles-guard";
import { CreateAgendaDTO } from "src/dto/create-agenda.dto";
import { AgendaUseCase } from "src/use-cases/agendas/agenda.use-case";

@ApiTags('Agendas')
@Controller('Agenda')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgendaController {

    private readonly logger = new Logger(AgendaController.name);

    constructor(private agendaUseCase: AgendaUseCase) {

    }

    @Post()
    @Roles('doctor')
    createNewAgenda(@Body() agenda: CreateAgendaDTO) {
        this.logger.log(`createNewAgenda(CreateAgendaDTO) - Start`);
        return this.agendaUseCase.createAgenda(agenda);
    }

    @Get()
    @Roles('doctor')
    getAllAgendas() {
        this.logger.log(`getAllAgendas() - Start`);
        return this.agendaUseCase.getAllAgendas();
    }

    @Get('/doctor/:doctorId')
    @Roles('doctor')
    getAgendasByDoctorId(@Param('doctorId') doctorId: number) {
        this.logger.log(`getAgendasByDoctorId(number) - Start`);
        return this.agendaUseCase.getAgendasByDoctorId(doctorId);
    }

    @Put('/doctor/:agendaId')
    @Roles('doctor')
    updateAgenda(@Body() agenda: CreateAgendaDTO, @Param('agendaId') agendaId: number) {
        this.logger.log(`updateAgenda(CreateAgendaDTO, number) - Start`);
        return this.agendaUseCase.updateAgenda(agenda, agendaId);
    }

    @Get('/:agendaId')
    @Roles('doctor')
    getAgenda(@Param('agendaId') agendaId: number) {
        this.logger.log(`getAgenda(number) - Start`);
        return this.agendaUseCase.getAgendaById(agendaId);
    }

    @Delete('/:agendaId')
    @Roles('doctor')
    deleteAgenda(@Param('agendaId') agendaId: number) {
        this.logger.log(`deleteAgenda(number) - Start`);
        return this.agendaUseCase.deleteAgenda(agendaId);
    }
}