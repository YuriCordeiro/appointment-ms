import { AxiosResponse } from "axios";
import { DoctorResponseDTO } from "src/adapter/driver/dtos/doctor-response.dto";
import { IMedPort } from "../ports/med.port";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MedAdapter implements IMedPort {

    constructor(private readonly httpService: HttpService) { }

    getDoctorById(doctorId: string): Promise<AxiosResponse<DoctorResponseDTO>> {
        const externalURL: string = `http://afac82f1a6b784cad8d099bc19767025-491367876.us-east-1.elb.amazonaws.com/doctors/id/${doctorId}`;

        return this.httpService.axiosRef.get(externalURL);
    }

}