import { Test, TestingModule } from '@nestjs/testing';
import { AgendaUseCase } from 'src/core/application/use-cases/agendas/agenda.use-case';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { CreateAgendaDTO } from 'src/adapter/driver/dtos/create-agenda.dto';
import { Agenda } from 'src/core/domain/entities/agenda.model';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockDataServices = () => ({
  agendas: {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByDoctorId: jest.fn(),
  },
});

describe('AgendaUseCase', () => {
  let agendaUseCase: AgendaUseCase;
  let dataServicesMock: ReturnType<typeof mockDataServices>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaUseCase,
        { provide: IDataServices, useValue: mockDataServices() },
      ],
    }).compile();

    agendaUseCase = module.get<AgendaUseCase>(AgendaUseCase);
    dataServicesMock = module.get(IDataServices);
  });

  it('should be defined', () => {
    expect(agendaUseCase).toBeDefined();
  });

  describe('createAgenda', () => {
    it('should create and return a new agenda', async () => {
      const agendaDTO: CreateAgendaDTO = {
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

      dataServicesMock.agendas.getByDoctorId.mockResolvedValue([]);
      dataServicesMock.agendas.create.mockResolvedValue(createdAgenda);

      const result = await agendaUseCase.createAgenda(agendaDTO);

      expect(result).toEqual(createdAgenda);
      expect(dataServicesMock.agendas.create).toHaveBeenCalledWith(expect.any(Agenda));
    });

    it('should throw a ConflictException if an agenda already exists at the same date and time', async () => {
      const agendaDTO: CreateAgendaDTO = {
        doctorId: 1,
        date: new Date(),
        isAvailable: true,
      };

      const existingAgenda: Agenda = {
        id: 1,
        doctorId: 1,
        date: new Date(agendaDTO.date),
        isAvailable: true,
      } as Agenda;

      dataServicesMock.agendas.getByDoctorId.mockResolvedValue([existingAgenda]);

      await expect(agendaUseCase.createAgenda(agendaDTO)).rejects.toThrow(ConflictException);
    });
  });

  describe('getAllAgendas', () => {
    it('should return an array of all agendas', async () => {
      const agendas: Agenda[] = [
        { id: 1, doctorId: 1, date: new Date(), isAvailable: true },
        { id: 2, doctorId: 2, date: new Date(), isAvailable: false },
      ];

      dataServicesMock.agendas.getAll.mockResolvedValue(agendas);

      const result = await agendaUseCase.getAllAgendas();

      expect(result).toEqual(agendas);
      expect(dataServicesMock.agendas.getAll).toHaveBeenCalled();
    });
  });

  describe('bookDateAtDoctorAgenda', () => {
    it('should book a date by marking the agenda as unavailable', async () => {
      const appointmentDate = new Date();
      const doctorId = 1;

      const availableAgenda: Agenda = {
          id: 1,
          doctorId: doctorId,
          date: appointmentDate,
          isAvailable: true,
      } as Agenda;

      const updatedAgenda: Agenda = {
          ...availableAgenda,
          isAvailable: false,
      };

      dataServicesMock.agendas.getByDoctorId.mockResolvedValue([availableAgenda]);
      dataServicesMock.agendas.update.mockResolvedValue(updatedAgenda);

      const result = await agendaUseCase.bookDateAtDoctorAgenda(doctorId, appointmentDate);

      expect(result).toEqual(updatedAgenda);
      expect(dataServicesMock.agendas.update).toHaveBeenCalledWith(
          availableAgenda.id.toString(),
          {
              ...availableAgenda,
              isAvailable: false,
          }
      );
    });
  });

  describe('doctorHasAvailbeAgenda', () => {
    it('should return available agendas for a given doctor and date', async () => {
      const doctorId = 1;
      const appointmentDate = new Date();

      const availableAgenda: Agenda = {
        id: 1,
        doctorId: doctorId,
        date: appointmentDate,
        isAvailable: true,
      } as Agenda;

      dataServicesMock.agendas.getByDoctorId.mockResolvedValue([availableAgenda]);

      const result = await agendaUseCase.doctorHasAvailbeAgenda(doctorId, appointmentDate);

      expect(result).toEqual([availableAgenda]);
      expect(dataServicesMock.agendas.getByDoctorId).toHaveBeenCalledWith(doctorId);
    });
  });

  describe('updateAgenda', () => {
    it('should update and return the updated agenda', async () => {
      const agendaId = 1;
      const agendaDTO: CreateAgendaDTO = {
        doctorId: 1,
        date: new Date(),
        isAvailable: false,
      };

      const foundAgenda: Agenda = {
        id: agendaId,
        doctorId: 1,
        date: new Date(),
        isAvailable: true,
      };

      dataServicesMock.agendas.get.mockResolvedValue(foundAgenda);
      dataServicesMock.agendas.update.mockResolvedValue(foundAgenda);

      const result = await agendaUseCase.updateAgenda(agendaDTO, agendaId);

      expect(result).toEqual(foundAgenda);
      expect(dataServicesMock.agendas.update).toHaveBeenCalledWith(agendaId.toString(), foundAgenda);
    });

    it('should throw a NotFoundException if the agenda is not found', async () => {
      const agendaId = 999;
      const agendaDTO: CreateAgendaDTO = {
        doctorId: 1,
        date: new Date(),
        isAvailable: false,
      };

      dataServicesMock.agendas.get.mockResolvedValue(null);

      await expect(agendaUseCase.updateAgenda(agendaDTO, agendaId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAgenda', () => {
    it('should delete the agenda with the given ID', async () => {
      const agendaId = 1;

      await agendaUseCase.deleteAgenda(agendaId);

      expect(dataServicesMock.agendas.delete).toHaveBeenCalledWith(agendaId.toString());
    });
  });
});
