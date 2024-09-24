import { AxiosResponse } from "axios";
import { DoctorResponseDTO } from "src/adapter/driver/dtos/doctor-response.dto";
import { IMedPort } from "../ports/med.port";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MedAdapter implements IMedPort {

    constructor(private readonly httpService: HttpService) { }

    getDoctorById(doctorId: string): Promise<AxiosResponse<DoctorResponseDTO>> {
        const externalURL: string = `http://localhost:3004/doctors/id/${doctorId}`;

        return this.httpService.axiosRef.get(externalURL);
    }

}