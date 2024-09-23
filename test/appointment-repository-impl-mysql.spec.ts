import { Appointment } from "src/frameworks/data-services/mysql/entities/appointment.model";
import { AppointmentRepositoryImpl } from "src/frameworks/data-services/mysql/gateways/appointment.repository";

// Mock do modelo Appointment
const mockAppointmentModel = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

describe('AppointmentRepositoryImpl', () => {
  let repository: AppointmentRepositoryImpl;
  let appointmentModel: ReturnType<typeof mockAppointmentModel>;

  beforeEach(async () => {
    appointmentModel = mockAppointmentModel() as any;

    repository = new AppointmentRepositoryImpl(appointmentModel as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of Appointments', async () => {
      const Appointments = [{ doctorId: 1, patientId: 5, startDate: new Date(), status: 'scheduled' } as Appointment, { doctorId: 2, patientId: 10, startDate: new Date(), status: 'scheduled' } as Appointment];
      appointmentModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(Appointments),
      });

      const result = await repository.getAll();
      expect(result).toEqual(Appointments);
      expect(appointmentModel.find).toHaveBeenCalled();
    });

    it('should return an empty array when no Appointments are found', async () => {
      const Appointments = [];
      appointmentModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(Appointments),
      });

      const result = await repository.getAll();
      expect(result).toEqual(Appointments);
      expect(appointmentModel.find).toHaveBeenCalled();
    });
  });

  describe('getAppointmentByDoctorId', () => {
    it('should return a Appointment when found', async () => {
      const doctorId: number = 10;
      const Appointment = { doctorId: doctorId, patientId: 5, startDate: new Date(), status: 'scheduled' } as Appointment;
      appointmentModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([Appointment]),
      });

      const result = await repository.getByDoctorId(doctorId);
      expect(result).toEqual([Appointment]);
      expect(appointmentModel.find).toHaveBeenCalledWith({ doctorId: doctorId });
    });

    describe('getAppointmentByPatientId', () => {
      it('should return a Appointment when found', async () => {
        const patientId: number = 10;
        const Appointment = { doctorId: 1, patientId: patientId, startDate: new Date(), status: 'scheduled' } as Appointment;
        appointmentModel.find.mockReturnValue({
          exec: jest.fn().mockResolvedValue([Appointment]),
        });

        const result = await repository.getByPatientId(patientId);
        expect(result).toEqual([Appointment]);
        expect(appointmentModel.find).toHaveBeenCalledWith({ patientId: patientId });
      });

      it('should return an empty array when no Appointment is found', async () => {
        const appointmentId = 110;
        appointmentModel.find.mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        });

        const result = await repository.get(appointmentId);
        expect(result).toEqual([]);
        expect(appointmentModel.find).toHaveBeenCalledWith({ id: appointmentId });
      });

      it('should return a Appointment when found by id', async () => {
        const appointmentId = 115;
        const Appointment = { id: appointmentId, doctorId: 1, patientId: 15, startDate: new Date(), status: 'scheduled' } as unknown as Appointment;
        appointmentModel.find.mockReturnValue({
          exec: jest.fn().mockResolvedValue(Appointment),
        });

        const result = await repository.get(appointmentId);
        expect(result).toEqual(Appointment);
        expect(appointmentModel.find).toHaveBeenCalledWith(appointmentId);
      });

      it('should return null when no Appointment is found by id', async () => {
        const appointmentId = 110;
        appointmentModel.find.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        const result = await repository.get(appointmentId);
        expect(result).toEqual(null);
        expect(appointmentModel.find).toHaveBeenCalledWith(appointmentId);
      });


      it('should return a Appointment when created', async () => {
        const appointment = { id: 10, doctorId: 1, patientId: 15, startDate: new Date(), status: 'scheduled' } as Appointment;
        appointmentModel.save.mockResolvedValue(appointment);

        const result = await repository.create(appointment);
        expect(result).toEqual(appointment);
        expect(appointmentModel.save).toHaveBeenCalledWith(appointment);
      });

      it('should return a Appointment when updated', async () => {
        const appointmentId = 10;
        const appointment = { id: appointmentId, doctorId: 1, patientId: 15, startDate: new Date(), status: 'scheduled' } as unknown as Appointment;
        appointmentModel.update.mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue(appointment)
        });

        const result = await repository.update(appointmentId.toString(), appointment);
        expect(result).toEqual(appointment);
        expect(appointmentModel.update).toHaveBeenCalledWith({ appointmentId }, appointment);
      });

      it('should delete a customer', async () => {
        const appointmentId = 1;
        appointmentModel.delete.mockReturnValue({});

        await repository.delete(appointmentId.toString());

        expect(appointmentModel.delete).toHaveBeenCalledWith(appointmentId);
      });
    });
  })
});
