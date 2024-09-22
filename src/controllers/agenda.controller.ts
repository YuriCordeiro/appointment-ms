import { Body, Controller, Delete, Get, Logger, NotImplementedException, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateAgendaDTO } from "src/dto/create-agenda.dto";
import { AgendaUseCase } from "src/use-cases/agendas/agenda.use-case";

@ApiTags('Agendas')
@Controller('Agenda')
export class AgendaController {

    private readonly logger = new Logger(AgendaController.name);

    constructor(private agendaUseCase: AgendaUseCase) {

    }

    @Post()
    createNewAgenda(@Body() agenda: CreateAgendaDTO) {
        this.logger.log(`createNewAgenda(CreateAgendaDTO) - Start`);
        return this.agendaUseCase.createAgenda(agenda);
    }

    @Get()
    getAllAgendas() {
        this.logger.log(`getAllAgendas() - Start`);
        return this.agendaUseCase.getAllAgendas();
    }

    @Get('/doctor/:doctorId')
    getAgendasByDoctorId(@Param('doctorId') doctorId: number) {
        this.logger.log(`getAgendasByDoctorId(number) - Start`);
        return this.agendaUseCase.getAgendasByDoctorId(doctorId);
    }

    @Put('/doctor/:agendaId')
    updateAgenda(@Body() agenda: CreateAgendaDTO, @Param('agendaId') agendaId: number) {
        this.logger.log(`updateAgenda(CreateAgendaDTO, number) - Start`);
        return this.agendaUseCase.updateAgenda(agenda, agendaId);
    }

    @Get('/:agendaId')
    getAgenda(@Param('agendaId') agendaId: number) {
        this.logger.log(`getAgenda(number) - Start`);
        return this.agendaUseCase.getAgendaById(agendaId);
    }

    @Delete('/:agendaId')
    deleteAgenda(@Param('agendaId') agendaId: number) {
        this.logger.log(`deleteAgenda(number) - Start`);
        return this.agendaUseCase.deleteAgenda(agendaId);
    }
}