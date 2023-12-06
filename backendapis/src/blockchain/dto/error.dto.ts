import { ApiProperty } from "@nestjs/swagger";

export class ErrorDto{
    @ApiProperty()
    readonly statusCode: number;
    @ApiProperty()
    readonly message: string;
}