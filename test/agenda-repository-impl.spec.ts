import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agenda } from 'src/core/domain/entities/agenda.model';
import { AgendaRepositoryImpl } from 'src/adapter/driven/repositories/agenda.repository';

const mockAgendaRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findOneBy: jest.fn(),
});

describe('AgendaRepositoryImpl', () => {
  let agendaRepositoryImpl: AgendaRepositoryImpl;
  let agendaRepository: jest.Mocked<Repository<Agenda>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(Agenda), useValue: mockAgendaRepository() },
      ],
    }).compile();

    agendaRepository = module.get<jest.Mocked<Repository<Agenda>>>(getRepositoryToken(Agenda));
    agendaRepositoryImpl = new AgendaRepositoryImpl(agendaRepository); // Inicialize corretamente com o mock
  });

  it('should be defined', () => {
    expect(agendaRepositoryImpl).toBeDefined();
  });

  describe('getByDoctorId', () => {
    it('should return an array of agendas for the given doctorId', async () => {
      const agendas: Agenda[] = [
        { id: 1, doctorId: 1, date: new Date(), isAvailable: true },
        { id: 2, doctorId: 1, date: new Date(), isAvailable: false },
      ];

      agendaRepository.find.mockResolvedValueOnce(agendas);

      const result = await agendaRepositoryImpl.getByDoctorId(1);

      expect(result).toEqual(agendas);
      expect(agendaRepository.find).toHaveBeenCalledWith({ where: { doctorId: 1 } });
    });

    it('should return an empty array if no agendas are found for the given doctorId', async () => {
      agendaRepository.find.mockResolvedValueOnce([]);

      const result = await agendaRepositoryImpl.getByDoctorId(999);

      expect(result).toEqual([]);
      expect(agendaRepository.find).toHaveBeenCalledWith({ where: { doctorId: 999 } });
    });
  });

  describe('getAllAgendas', () => {
    it('should return an array of all agendas', async () => {
      const agendas: Agenda[] = [
        { id: 1, doctorId: 1, date: new Date(), isAvailable: true },
        { id: 2, doctorId: 2, date: new Date(), isAvailable: false },
      ];

      agendaRepository.find.mockResolvedValueOnce(agendas);

      const result = await agendaRepositoryImpl.getAll();

      expect(result).toEqual(agendas);
      expect(agendaRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no agendas are found', async () => {
      agendaRepository.find.mockResolvedValueOnce([]);

      const result = await agendaRepositoryImpl.getAll();

      expect(result).toEqual([]);
      expect(agendaRepository.find).toHaveBeenCalled();
    });
  });

  describe('createAgenda', () => {
    it('should create and return the new agenda', async () => {
      const newAgenda: Agenda = {
        id: 1,
        doctorId: 1,
        date: new Date(),
        isAvailable: true,
      };

      agendaRepository.save.mockResolvedValueOnce(newAgenda);

      const result = await agendaRepositoryImpl.create(newAgenda);

      expect(result).toEqual(newAgenda);
      expect(agendaRepository.save).toHaveBeenCalledWith(newAgenda);
    });
  });

  describe('deleteAgenda', () => {
    it('should delete the agenda with the given ID', async () => {
      agendaRepository.delete.mockResolvedValueOnce({ affected: 1 } as any);

      await agendaRepositoryImpl.delete('1');

      expect(agendaRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('updateAgenda', () => {
    it('should update and return the updated agenda', async () => {
      const updatedAgenda: Agenda = {
        id: 1,
        doctorId: 1,
        date: new Date(),
        isAvailable: false,
      };

      agendaRepository.update.mockResolvedValueOnce({ affected: 1 } as any);
      agendaRepository.findOneBy.mockResolvedValueOnce(updatedAgenda);

      const result = await agendaRepositoryImpl.update('1', updatedAgenda);

      expect(result).toEqual(updatedAgenda);
      expect(agendaRepository.update).toHaveBeenCalledWith({"id": "1"}, updatedAgenda);
      expect(agendaRepository.findOneBy).toHaveBeenCalledWith({"id": "1"});
    });

    it('should return null if the agenda to update is not found', async () => {
      const updatedAgenda: Agenda = {
        id: 999,
        doctorId: 1,
        date: new Date(),
        isAvailable: false,
      };

      agendaRepository.update.mockResolvedValueOnce({ affected: 0 } as any);
      agendaRepository.findOneBy.mockResolvedValueOnce(null);

      const result = await agendaRepositoryImpl.update('999', updatedAgenda);

      expect(result).toBeNull();
      expect(agendaRepository.update).toHaveBeenCalledWith({"id": "999"}, updatedAgenda);
      expect(agendaRepository.findOneBy).toHaveBeenCalledWith({"id": "999"});
    });
  });
});
