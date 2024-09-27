import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAppointmentDTO {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly doctorId: number;
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly patientId: number;
    @ApiProperty({ example: '2024-11-24T15:00:00.000Z' })
    @IsDate()
    @IsNotEmpty()
    readonly startDate: Date;
    readonly status: string; // Auto filled by use case
}