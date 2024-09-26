import { AxiosResponse } from "axios";
import { DoctorResponseDTO } from "src/adapter/driver/dtos/doctor-response.dto";
import { IMedPort } from "../ports/med.port";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MedAdapter implements IMedPort {

    constructor(private readonly httpService: HttpService) { }

    getDoctorById(doctorId: string): Promise<AxiosResponse<DoctorResponseDTO>> {
        const externalURL: string = `http://a1a2153278873405687cb0df00f7d919-492228261.us-east-1.elb.amazonaws.com/doctors/id/${doctorId}`;

        return this.httpService.axiosRef.get(externalURL, {
            headers: { 'Content-Type': 'application/json' },
            proxy: false
        })
            .then((response) => {
                Logger.log(`Response from ${externalURL}`);
                Logger.log(response.data);
                return response;
            })
            .catch((error) => {
                Logger.error(`Error from ${externalURL}`);
                if (error.response) {
                    Logger.error(`Error status: ${error.response.status}`);
                    Logger.error(`Error data: ${JSON.stringify(error.response.data)}`);
                } else {
                    Logger.error(`Error message: ${error.message}`);
                }
                return null;
            });
    }

}