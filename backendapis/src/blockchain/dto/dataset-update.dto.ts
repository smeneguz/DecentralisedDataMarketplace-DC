import { ApiProperty } from "@nestjs/swagger";

export class UpdateDataDto{
    @ApiProperty({required: false})
    readonly name?: string;
    @ApiProperty({required: false})
    readonly symbol?: string;
    @ApiProperty({required: false})
    readonly tokenURI?: string;
    @ApiProperty({required: false})
    readonly transferable?: boolean;
}