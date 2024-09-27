import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentUseCase } from 'src/core/application/use-cases/appointments/appointment.use-case';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { IMedPort, IMedPortToken } from 'src/adapter/driven/transport/ports/med.port';
import { CreateAppointmentDTO } from 'src/adapter/driver/dtos/create-appointment.dto';
import { Appointment } from 'src/core/domain/entities/appointment.model';
import { EmailService } from 'src/adapter/driven/email/email.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MurLockService } from 'murlock';

const mockDataServices = () => ({
  appointments: {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByDoctorId: jest.fn(),
    getByPatientId: jest.fn(),
  },
});

const mockAgendaUseCase = () => ({
  doctorHasAvailbeAgenda: jest.fn(),
  bookDateAtDoctorAgenda: jest.fn(),
  getAgendasByDoctorId: jest.fn(),
  updateAgenda: jest.fn(),
});

const mockEmailService = () => ({
  sendEmail: jest.fn(),
});

const mockMedPort = () => ({
  getDoctorById: jest.fn().mockResolvedValue({
    data: {
      email: 'doctor@example.com',
      name: 'Dr. John Doe',
    },
  }),
});

const mockMurLockService = {
  lock: jest.fn(),
  unlock: jest.fn(),
  runWithLock: jest.fn((key, options, callback) => callback()),
  options: {
    lockKeyPrefix: 'somePrefix',
    ttl: 1000,
  }
};

describe('AppointmentUseCase', () => {
  let appointmentUseCase: AppointmentUseCase;
  let dataServicesMock: ReturnType<typeof mockDataServices>;
  let agendaUseCaseMock: ReturnType<typeof mockAgendaUseCase>;
  let emailServiceMock: ReturnType<typeof mockEmailService>;
  let medPortMock: ReturnType<typeof mockMedPort>;
  let murLockServiceMock: typeof mockMurLockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentUseCase,
        { provide: IDataServices, useValue: mockDataServices() },
        { provide: 'IAgendaUseCase', useValue: mockAgendaUseCase() },
        { provide: EmailService, useValue: mockEmailService() },
        { provide: IMedPortToken, useValue: mockMedPort() },
        { provide: MurLockService, useValue: mockMurLockService },
      ],
    }).compile();
  
    appointmentUseCase = module.get<AppointmentUseCase>(AppointmentUseCase);
    dataServicesMock = module.get(IDataServices);
    agendaUseCaseMock = module.get('IAgendaUseCase');
    emailServiceMock = module.get(EmailService);
    medPortMock = module.get(IMedPortToken);
    murLockServiceMock = module.get(MurLockService);
  });

  it('should be defined', () => {
    expect(appointmentUseCase).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create a new appointment and return it', async () => {
      const appointmentDTO: CreateAppointmentDTO = {
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        status: 'Scheduled',
      };
      const patientName = 'John Doe';

      const doctorAvailableAgendas = [{ date: new Date() }];
      const createdAppointment: Appointment = {
        id: 1,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Scheduled',
      } as Appointment;

      agendaUseCaseMock.doctorHasAvailbeAgenda.mockResolvedValue(doctorAvailableAgendas);
      agendaUseCaseMock.bookDateAtDoctorAgenda.mockResolvedValue(null);
      dataServicesMock.appointments.create.mockResolvedValue(createdAppointment);
      dataServicesMock.appointments.getByDoctorId.mockResolvedValue([]);
      emailServiceMock.sendEmail.mockResolvedValue(null);

      const result = await appointmentUseCase.createAppointment(appointmentDTO, patientName);

      expect(result).toEqual(createdAppointment);
      expect(agendaUseCaseMock.doctorHasAvailbeAgenda).toHaveBeenCalledWith(appointmentDTO.doctorId, appointmentDTO.startDate);
      expect(dataServicesMock.appointments.create).toHaveBeenCalledWith(expect.any(Appointment));
      expect(emailServiceMock.sendEmail).toHaveBeenCalled();
    });

    it('should throw a ConflictException if doctor has appointment conflicts', async () => {
      const appointmentDTO: CreateAppointmentDTO = {
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        status: 'Scheduled',
      };
      const patientName = 'John Doe';

      const doctorAvailableAgendas = [{ date: new Date() }];
      const conflictingAppointments: Appointment[] = [
        { id: 1, doctorId: 1, patientId: 2, startDate: new Date(), endDate: new Date(), status: 'scheduled' } as Appointment,
      ];

      agendaUseCaseMock.doctorHasAvailbeAgenda.mockResolvedValue(doctorAvailableAgendas);
      dataServicesMock.appointments.getByDoctorId.mockResolvedValue(conflictingAppointments);

      await expect(appointmentUseCase.createAppointment(appointmentDTO, patientName)).rejects.toThrow(ConflictException);
    });

    it('should throw a NotFoundException if no available agendas are found', async () => {
      const appointmentDTO: CreateAppointmentDTO = {
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        status: 'Scheduled',
      };
      const patientName = 'John Doe';

      agendaUseCaseMock.doctorHasAvailbeAgenda.mockResolvedValue([]);

      dataServicesMock.appointments.getByDoctorId.mockResolvedValue([]);

      await expect(appointmentUseCase.createAppointment(appointmentDTO, patientName)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return an array of all appointments', async () => {
      const appointments: Appointment[] = [
        { id: 1, doctorId: 1, patientId: 1, startDate: new Date(), endDate: new Date(), status: 'Scheduled' },
        { id: 2, doctorId: 2, patientId: 2, startDate: new Date(), endDate: new Date(), status: 'Completed' },
      ];

      dataServicesMock.appointments.getAll.mockResolvedValue(appointments);

      const result = await appointmentUseCase.getAll();

      expect(result).toEqual(appointments);
      expect(dataServicesMock.appointments.getAll).toHaveBeenCalled();
    });
  });

  describe('getAppointmentById', () => {
    it('should return the appointment with the specified ID', async () => {
      const appointmentId = 1;
      const appointment: Appointment = {
        id: appointmentId,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Scheduled',
      } as Appointment;

      dataServicesMock.appointments.get.mockResolvedValue(appointment);

      const result = await appointmentUseCase.getAppointmentById(appointmentId);

      expect(result).toEqual(appointment);
      expect(dataServicesMock.appointments.get).toHaveBeenCalledWith(appointmentId);
    });
  });

  describe('updateAppointment', () => {
    it('should update and return the updated appointment', async () => {
      const appointmentId = 1;
      const appointmentDTO: CreateAppointmentDTO = {
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        status: 'Scheduled',
      };

      const foundAppointment: Appointment = {
        id: appointmentId,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'Scheduled',
      };

      dataServicesMock.appointments.get.mockResolvedValue(foundAppointment);
      dataServicesMock.appointments.update.mockResolvedValue(foundAppointment);

      const result = await appointmentUseCase.updateAppointment(appointmentId, appointmentDTO);

      expect(result).toEqual(foundAppointment);
      expect(dataServicesMock.appointments.update).toHaveBeenCalledWith(appointmentId.toString(), foundAppointment);
    });

    it('should throw a NotFoundException if the appointment is not found', async () => {
      const appointmentId = 999;
      const appointmentDTO: CreateAppointmentDTO = {
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        status: 'Scheduled',
      };

      dataServicesMock.appointments.get.mockResolvedValue(null);

      try {
        await appointmentUseCase.updateAppointment(appointmentId, appointmentDTO);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`No appointment with ID: ${appointmentId} were found.`);
      }
    });
  });

  describe('deleteAppointment', () => {
    it('should throw a NotFoundException if the appointment is not found', async () => {
      const appointmentId = 999;
      dataServicesMock.appointments.get.mockResolvedValue(null);

      try {
        await appointmentUseCase.deleteAppointment(appointmentId);
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`There is no appointment with ID: ${appointmentId} registered.`);
      }
    });
  });
});
