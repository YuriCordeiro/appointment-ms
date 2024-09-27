import { Axios, AxiosResponse } from "axios";
import { DoctorResponseDTO } from "src/adapter/driver/dtos/doctor-response.dto";

export interface IMedPort {

    getDoctorById(doctorId: string): Promise<AxiosResponse<DoctorResponseDTO>>;
}

export const IMedPortToken = Symbol("IMedPort");