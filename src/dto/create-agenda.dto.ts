import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateAgendaDTO {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly doctorId: number;
    @ApiProperty({ example: '2024-11-24 17:00:00' })
    @IsDate()
    @IsNotEmpty()
    readonly date: Date;
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    readonly isAvailable: boolean;
}