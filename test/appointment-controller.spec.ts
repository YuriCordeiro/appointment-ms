import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from 'src/adapter/driver/controllers/appointment/appointment.controller';
import { CreateAppointmentDTO } from 'src/adapter/driver/dtos/create-appointment.dto';
import { Appointment } from 'src/core/domain/entities/appointment.model';
import { JWTUtil } from 'src/adapter/driver/auth/jtw-util';
import { RolesGuard } from 'src/adapter/driver/auth/roles-guard';
import { JwtAuthGuard } from 'src/adapter/driver/auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const mockAppointmentUseCase = () => ({
  createAppointment: jest.fn(),
  getAll: jest.fn(),
  getByDoctorId: jest.fn(),
  getByPatientId: jest.fn(),
  getAppointmentById: jest.fn(),
  deleteAppointment: jest.fn(),
});

const mockJwtUtil = () => ({
  decode: jest.fn(),
});

describe('AppointmentController', () => {
  let appointmentController: AppointmentController;
  let appointmentUseCaseMock: ReturnType<typeof mockAppointmentUseCase>;
  let jwtUtilMock: ReturnType<typeof mockJwtUtil>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        { provide: 'IAppointmentUseCase', useFactory: mockAppointmentUseCase },
        { provide: JWTUtil, useFactory: mockJwtUtil },
        JwtAuthGuard,
        RolesGuard,
        Reflector,
      ],
    }).compile();

    appointmentController = module.get<AppointmentController>(AppointmentController);
    appointmentUseCaseMock = module.get('IAppointmentUseCase');
    jwtUtilMock = module.get(JWTUtil);
  });

  it('should be defined', () => {
    expect(appointmentController).toBeDefined();
  });

  describe('createNewAppointment', () => {
    it('should create and return a new appointment', async () => {
      const appointmentDTO: CreateAppointmentDTO = {
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        status: 'scheduled',
      };

      const createdAppointment: Appointment = {
        id: 1,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'scheduled',
      } as Appointment;

      jwtUtilMock.decode.mockReturnValue({
        sub: 1,
        role: 'patient',
        name: 'John Doe',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      });

      appointmentUseCaseMock.createAppointment.mockResolvedValue(createdAppointment);

      const result = await appointmentController.createNewAppointment(appointmentDTO, {
        headers: { authorization: 'Bearer token' },
      } as any);

      expect(result).toEqual(createdAppointment);
      expect(jwtUtilMock.decode).toHaveBeenCalledWith('Bearer token');
      expect(appointmentUseCaseMock.createAppointment).toHaveBeenCalledWith(appointmentDTO, 'John Doe');
    });
  });

  describe('getAllAppointments', () => {
    it('should return all appointments', async () => {
      const appointments: Appointment[] = [
        { id: 1, doctorId: 1, patientId: 1, startDate: new Date(), endDate: new Date(), status: 'scheduled' },
        { id: 2, doctorId: 2, patientId: 1, startDate: new Date(), endDate: new Date(), status: 'scheduled' },
      ];

      appointmentUseCaseMock.getAll.mockResolvedValue(appointments);

      const result = await appointmentController.getAllAppointments();

      expect(result).toEqual(appointments);
      expect(appointmentUseCaseMock.getAll).toHaveBeenCalled();
    });
  });

  describe('getAppointmentsByDoctorId', () => {
    it('should return appointments for a given doctor ID', async () => {
      const doctorId = 1;
      const appointments: Appointment[] = [
        { id: 1, doctorId: doctorId, patientId: 1, startDate: new Date(), endDate: new Date(), status: 'scheduled' },
      ];

      appointmentUseCaseMock.getByDoctorId.mockResolvedValue(appointments);

      const result = await appointmentController.getAppointmentsByDoctorId(doctorId);

      expect(result).toEqual(appointments);
      expect(appointmentUseCaseMock.getByDoctorId).toHaveBeenCalledWith(doctorId);
    });
  });

  describe('getAppointmentsByPatientId', () => {
    it('should return appointments for a given patient ID', async () => {
      const patientId = 1;
      const appointments: Appointment[] = [
        { id: 1, doctorId: 1, patientId: patientId, startDate: new Date(), endDate: new Date(), status: 'scheduled' },
      ];

      appointmentUseCaseMock.getByPatientId.mockResolvedValue(appointments);

      const result = await appointmentController.getAppointmentsByPatientId(patientId);

      expect(result).toEqual(appointments);
      expect(appointmentUseCaseMock.getByPatientId).toHaveBeenCalledWith(patientId);
    });
  });

  describe('getAppointment', () => {
    it('should return the appointment for a given ID', async () => {
      const appointmentId = 1;
      const appointment: Appointment = {
        id: appointmentId,
        doctorId: 1,
        patientId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'scheduled',
      } as Appointment;

      appointmentUseCaseMock.getAppointmentById.mockResolvedValue(appointment);

      const result = await appointmentController.getAppointment(appointmentId);

      expect(result).toEqual(appointment);
      expect(appointmentUseCaseMock.getAppointmentById).toHaveBeenCalledWith(appointmentId);
    });

    it('should throw a NotFoundException if the appointment is not found', async () => {
      const appointmentId = 999;

      appointmentUseCaseMock.getAppointmentById.mockRejectedValue(new NotFoundException());

      await expect(appointmentController.getAppointment(appointmentId)).rejects.toThrow(NotFoundException);
      expect(appointmentUseCaseMock.getAppointmentById).toHaveBeenCalledWith(appointmentId);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete the appointment with the given ID', async () => {
      const appointmentId = 1;

      appointmentUseCaseMock.deleteAppointment.mockResolvedValue(null);

      const result = await appointmentController.deleteAppointment(appointmentId);

      expect(result).toBeNull();
      expect(appointmentUseCaseMock.deleteAppointment).toHaveBeenCalledWith(appointmentId);
    });
  });
});
