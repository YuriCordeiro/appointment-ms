import { Agenda } from "src/frameworks/data-services/mysql/entities/Agenda.model";
import { AgendaRepositoryImpl } from "src/frameworks/data-services/mysql/gateways/Agenda.repository";

// Mock do modelo Agenda
const mockagendaModel = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

describe('AgendaRepositoryImpl', () => {
  let repository: AgendaRepositoryImpl;
  let agendaModel: ReturnType<typeof mockagendaModel>;

  beforeEach(async () => {
    agendaModel = mockagendaModel() as any;

    repository = new AgendaRepositoryImpl(agendaModel as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of agendas', async () => {
      const agendas = [{ id: 10, doctorId: 1, isAvailable: true, date: new Date() } as Agenda, { id: 11, doctorId: 2, isAvailable: false, date: new Date() } as Agenda];
      agendaModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(agendas),
      });

      const result = await repository.getAll();
      expect(result).toEqual(agendas);
      expect(agendaModel.find).toHaveBeenCalled();
    });

    it('should return an empty array when no agendas are found', async () => {
      const agendas = [];
      agendaModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(agendas),
      });

      const result = await repository.getAll();
      expect(result).toEqual(agendas);
      expect(agendaModel.find).toHaveBeenCalled();
    });
  });

  describe('getagendaByDoctorId', () => {
    it('should return a Agenda when found', async () => {
      const doctorId: number = 10;
      const Agenda = { id: 10, doctorId: 1, isAvailable: true, date: new Date() } as Agenda;
      agendaModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([Agenda]),
      });

      const result = await repository.getByDoctorId(doctorId);
      expect(result).toEqual([Agenda]);
      expect(agendaModel.find).toHaveBeenCalledWith({ doctorId: doctorId });
    });

    it('should return an empty array when no Agenda is found', async () => {
      const agendaId = 110;
      agendaModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await repository.get(agendaId);
      expect(result).toEqual([]);
      expect(agendaModel.find).toHaveBeenCalledWith({ id: agendaId });
    });

    it('should return a Agenda when found by id', async () => {
      const agendaId = 115;
      const Agenda = { id: 10, doctorId: 1, isAvailable: true, date: new Date() } as Agenda;
      agendaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(Agenda),
      });

      const result = await repository.get(agendaId);
      expect(result).toEqual(Agenda);
      expect(agendaModel.findById).toHaveBeenCalledWith(agendaId);
    });

    it('should return null when no Agenda is found by id', async () => {
      const agendaId = 110;
      agendaModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.get(agendaId);
      expect(result).toEqual(null);
      expect(agendaModel.findById).toHaveBeenCalledWith(agendaId);
    });


    it('should return a Agenda when created', async () => {
      const Agenda = { id: 10, doctorId: 1, isAvailable: true, date: new Date() } as Agenda;
      agendaModel.create.mockResolvedValue(Agenda);

      const result = await repository.create(Agenda);
      expect(result).toEqual(Agenda);
      expect(agendaModel.create).toHaveBeenCalledWith(Agenda);
    });

    it('should return a Agenda when updated', async () => {
      const agendaId = 10;
      const Agenda = { id: 10, doctorId: 1, isAvailable: true, date: new Date() } as Agenda;
      agendaModel.findByIdAndUpdate.mockResolvedValue(Agenda);

      const result = await repository.update(agendaId.toString(), Agenda);
      expect(result).toEqual(Agenda);
      expect(agendaModel.findByIdAndUpdate).toHaveBeenCalledWith(agendaId, Agenda, { new: true });
    });

    it('should delete a Agenda', async () => {
      const agendaId = 10;
      agendaModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      repository.delete(agendaId.toString());

      expect(agendaModel.findByIdAndDelete).toHaveBeenCalledWith(agendaId);
    });
  });
});
