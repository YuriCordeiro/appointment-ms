import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty } from "class-validator";

export class CreateAgendaDTO {

    @ApiProperty({ example: '2024-11-24T15:00:00.000Z' })
    @IsDate()
    @IsNotEmpty()
    readonly date: Date;
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    readonly isAvailable: boolean;
}