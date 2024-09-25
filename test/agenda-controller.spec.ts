import { Test, TestingModule } from '@nestjs/testing';
import { AgendaController } from 'src/adapter/driver/controllers/agenda/agenda.controller';
import { AgendaUseCase } from 'src/core/application/use-cases/agendas/agenda.use-case';
import { CreateAgendaDTO } from 'src/adapter/driver/dtos/create-agenda.dto';
import { JwtAuthGuard } from 'src/adapter/driver/auth/jwt-auth.guard';
import { RolesGuard } from 'src/adapter/driver/auth/roles-guard';
import { NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/adapter/driver/auth/decorator-roles';
import { Agenda } from 'src/core/domain/entities/agenda.model';

const mockAgendaUseCase = () => ({
  createAgenda: jest.fn(),
  getAllAgendas: jest.fn(),
  getAgendasByDoctorId: jest.fn(),
  updateAgenda: jest.fn(),
  getAgendaById: jest.fn(),
  deleteAgenda: jest.fn(),
});

describe('AgendaController', () => {
  let agendaController: AgendaController;
  let agendaUseCaseMock: ReturnType<typeof mockAgendaUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendaController],
      providers: [
        { provide: AgendaUseCase, useFactory: mockAgendaUseCase },
        JwtAuthGuard,
        RolesGuard,
        Reflector,
      ],
    }).compile();

    agendaController = module.get<AgendaController>(AgendaController);
    agendaUseCaseMock = module.get(AgendaUseCase);
  });

  it('should be defined', () => {
    expect(agendaController).toBeDefined();
  });

  describe('createNewAgenda', () => {
    it('should create a new agenda and return it', async () => {
      const createAgendaDTO: CreateAgendaDTO = {
        doctorId: 1,
        date: new Date(),
        isAvailable: true,
      };

      const createdAgenda: Agenda = {
        id: 1,
        doctorId: 1,
        date: new Date(),
        isAvailable: true,
      } as Agenda;

      agendaUseCaseMock.createAgenda.mockResolvedValue(createdAgenda);

      const result = await agendaController.createNewAgenda(createAgendaDTO);

      expect(result).toEqual(createdAgenda);
      expect(agendaUseCaseMock.createAgenda).toHaveBeenCalledWith(createAgendaDTO);
    });
  });

  describe('getAllAgendas', () => {
    it('should return all agendas', async () => {
      const agendas: Agenda[] = [
        { id: 1, doctorId: 1, date: new Date(), isAvailable: true },
        { id: 2, doctorId: 2, date: new Date(), isAvailable: false },
      ];

      agendaUseCaseMock.getAllAgendas.mockResolvedValue(agendas);

      const result = await agendaController.getAllAgendas();

      expect(result).toEqual(agendas);
      expect(agendaUseCaseMock.getAllAgendas).toHaveBeenCalled();
    });
  });

  describe('getAgendasByDoctorId', () => {
    it('should return agendas for a given doctor ID', async () => {
      const doctorId = 1;
      const agendas: Agenda[] = [
        { id: 1, doctorId: doctorId, date: new Date(), isAvailable: true },
      ];

      agendaUseCaseMock.getAgendasByDoctorId.mockResolvedValue(agendas);

      const result = await agendaController.getAgendasByDoctorId(doctorId);

      expect(result).toEqual(agendas);
      expect(agendaUseCaseMock.getAgendasByDoctorId).toHaveBeenCalledWith(doctorId);
    });
  });

  describe('updateAgenda', () => {
    it('should update an agenda and return the updated agenda', async () => {
      const agendaId = 1;
      const updateAgendaDTO: CreateAgendaDTO = {
        doctorId: 1,
        date: new Date(),
        isAvailable: false,
      };

      const updatedAgenda: Agenda = {
        id: agendaId,
        doctorId: 1,
        date: new Date(),
        isAvailable: false,
      } as Agenda;

      agendaUseCaseMock.updateAgenda.mockResolvedValue(updatedAgenda);

      const result = await agendaController.updateAgenda(updateAgendaDTO, agendaId);

      expect(result).toEqual(updatedAgenda);
      expect(agendaUseCaseMock.updateAgenda).toHaveBeenCalledWith(updateAgendaDTO, agendaId);
    });
  });

  describe('getAgenda', () => {
    it('should return the agenda for a given ID', async () => {
      const agendaId = 1;
      const agenda: Agenda = {
        id: agendaId,
        doctorId: 1,
        date: new Date(),
        isAvailable: true,
      } as Agenda;

      agendaUseCaseMock.getAgendaById.mockResolvedValue(agenda);

      const result = await agendaController.getAgenda(agendaId);

      expect(result).toEqual(agenda);
      expect(agendaUseCaseMock.getAgendaById).toHaveBeenCalledWith(agendaId);
    });

    it('should throw a NotFoundException if the agenda is not found', async () => {
      const agendaId = 999;

      agendaUseCaseMock.getAgendaById.mockRejectedValue(new NotFoundException());

      await expect(agendaController.getAgenda(agendaId)).rejects.toThrow(NotFoundException);
      expect(agendaUseCaseMock.getAgendaById).toHaveBeenCalledWith(agendaId);
    });
  });

  describe('deleteAgenda', () => {
    it('should delete the agenda with the given ID', async () => {
      const agendaId = 1;

      agendaUseCaseMock.deleteAgenda.mockResolvedValue(null);

      const result = await agendaController.deleteAgenda(agendaId);

      expect(result).toBeNull();
      expect(agendaUseCaseMock.deleteAgenda).toHaveBeenCalledWith(agendaId);
    });
  });
});
