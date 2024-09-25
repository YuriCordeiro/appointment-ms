import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from 'src/core/domain/entities/appointment.model';
import { AppointmentRepositoryImpl } from 'src/adapter/driven/repositories/appointment.repository';

const mockAppointmentRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findOneBy: jest.fn(),
});

describe('AppointmentRepositoryImpl', () => {
  let appointmentRepositoryImpl: AppointmentRepositoryImpl;
  let appointmentRepository: jest.Mocked<Repository<Appointment>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentRepositoryImpl,
        { provide: getRepositoryToken(Appointment), useValue: mockAppointmentRepository() },
      ],
    }).compile();

    appointmentRepository = module.get<jest.Mocked<Repository<Appointment>>>(getRepositoryToken(Appointment));
    appointmentRepositoryImpl = new AppointmentRepositoryImpl(appointmentRepository);
  });

  it('should be defined', () => {
    expect(appointmentRepositoryImpl).toBeDefined();
  });

  describe('getByDoctorId', () => {
    it('should return an array of appointments for the given doctorId', async () => {
      const appointments: Appointment[] = [
        {id: 1, doctorId: 1, patientId: 1, startDate: new Date(), status: 'Scheduled', endDate: undefined},
        { id: 2, doctorId: 1, patientId: 2, startDate: new Date(), status: 'Completed', endDate: undefined},
      ];

      appointmentRepository.find.mockResolvedValueOnce(appointments);

      const result = await appointmentRepositoryImpl.getByDoctorId(1);

      expect(result).toEqual(appointments);
      expect(appointmentRepository.find).toHaveBeenCalledWith({ where: { doctorId: 1 } });
    });

    it('should return an empty array if no appointments are found for the given doctorId', async () => {
      appointmentRepository.find.mockResolvedValueOnce([]);

      const result = await appointmentRepositoryImpl.getByDoctorId(999);

      expect(result).toEqual([]);
      expect(appointmentRepository.find).toHaveBeenCalledWith({ where: { doctorId: 999 } });
    });
  });

  describe('getByPatientId', () => {
    it('should return an array of appointments for the given patientId', async () => {
      const appointments: Appointment[] = [
        {id: 1, doctorId: 1, patientId: 1, startDate: new Date(), status: 'Scheduled', endDate: undefined},
        {id: 2, doctorId: 2, patientId: 2, startDate: new Date(), status: 'Cancelled', endDate: undefined},
      ];

      appointmentRepository.find.mockResolvedValueOnce(appointments);

      const result = await appointmentRepositoryImpl.getByPatientId(1);

      expect(result).toEqual(appointments);
      expect(appointmentRepository.find).toHaveBeenCalledWith({ where: { patientId: 1 } });
    });

    it('should return an empty array if no appointments are found for the given patientId', async () => {
      appointmentRepository.find.mockResolvedValueOnce([]);

      const result = await appointmentRepositoryImpl.getByPatientId(999);

      expect(result).toEqual([]);
      expect(appointmentRepository.find).toHaveBeenCalledWith({ where: { patientId: 999 } });
    });
  });

  describe('createAppointment', () => {
    it('should create and return the new appointment', async () => {
      const newAppointment: Appointment = {
        id: 1,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Scheduled',
      };

      appointmentRepository.save.mockResolvedValueOnce(newAppointment);

      const result = await appointmentRepositoryImpl.create(newAppointment);

      expect(result).toEqual(newAppointment);
      expect(appointmentRepository.save).toHaveBeenCalledWith(newAppointment);
    });
  });

  describe('getAppointment', () => {
    it('should return the appointment with the given ID', async () => {
      const appointment: Appointment = {
        id: 1,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Scheduled',
      };

      appointmentRepository.findOneBy.mockResolvedValueOnce(appointment);

      const result = await appointmentRepositoryImpl.get(1);

      expect(result).toEqual(appointment);
      expect(appointmentRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if the appointment with the given ID does not exist', async () => {
      appointmentRepository.findOneBy.mockResolvedValueOnce(null);

      const result = await appointmentRepositoryImpl.get(999);

      expect(result).toBeNull();
      expect(appointmentRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('updateAppointment', () => {
    it('should update and return the updated appointment', async () => {
      const updatedAppointment: Appointment = {
        id: 1,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Completed',
      };

      appointmentRepository.update.mockResolvedValueOnce({ affected: 1 } as any);
      appointmentRepository.findOneBy.mockResolvedValueOnce(updatedAppointment);

      const result = await appointmentRepositoryImpl.update('1', updatedAppointment);

      expect(result).toEqual(updatedAppointment);
      expect(appointmentRepository.update).toHaveBeenCalledWith({ "id": "1" }, updatedAppointment);
      expect(appointmentRepository.findOneBy).toHaveBeenCalledWith({ "id": "1" });
    });

    it('should return null if the appointment to update is not found', async () => {
      const updatedAppointment: Appointment = {
        id: 999,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Completed',
      };

      appointmentRepository.update.mockResolvedValueOnce({ affected: 0 } as any);
      appointmentRepository.findOneBy.mockResolvedValueOnce(null);

      const result = await appointmentRepositoryImpl.update('999', updatedAppointment);

      expect(result).toBeNull();
      expect(appointmentRepository.update).toHaveBeenCalledWith({ "id": "999" }, updatedAppointment);
      expect(appointmentRepository.findOneBy).toHaveBeenCalledWith({ "id": "999" });
    });
  });

  describe('deleteAppointment', () => {
    it('should delete the appointment with the given ID', async () => {
      appointmentRepository.delete.mockResolvedValueOnce({ affected: 1 } as any);

      await appointmentRepositoryImpl.delete('1');

      expect(appointmentRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
