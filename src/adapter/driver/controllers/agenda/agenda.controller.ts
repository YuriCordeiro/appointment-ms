import { Body, Controller, Delete, Get, Logger, NotImplementedException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Roles } from "src/adapter/driver/auth/decorator-roles";
import { JwtAuthGuard } from "src/adapter/driver/auth/jwt-auth.guard";
import { RolesGuard } from "src/adapter/driver/auth/roles-guard";
import { CreateAgendaDTO } from "src/adapter/driver/dtos/create-agenda.dto";
import { AgendaUseCase } from "src/core/application/use-cases/agendas/agenda.use-case";
import { JWTUtil } from "../../auth/jtw-util";
import { Timestamp } from "typeorm";

@ApiBearerAuth()
@ApiTags('Agendas')
@Controller('Agenda')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgendaController {

    private readonly logger = new Logger(AgendaController.name);

    constructor(private agendaUseCase: AgendaUseCase, private jwtUtil: JWTUtil) {

    }

    @Post()
    @Roles('doctor')
    createNewAgenda(@Req() request: Request, @Body() agenda: CreateAgendaDTO) {
        this.logger.log(`createNewAgenda(CreateAgendaDTO) - Start`);
        const jwt = request.headers.authorization;
        const json = this.jwtUtil.decode(jwt) as { sub: number, role: string, name: string, iat: Timestamp, exp: Timestamp };
        const loggedDoctorId = json.sub;
        return this.agendaUseCase.createAgenda(agenda, loggedDoctorId);
    }

    @Get()
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