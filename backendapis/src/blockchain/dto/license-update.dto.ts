import { ApiProperty } from "@nestjs/swagger";

export class UpdateLicenseDto{
    @ApiProperty({required: false})
    readonly price?: number;
    @ApiProperty({required: false})
    readonly name?: string;
    @ApiProperty({required: false})
    readonly symbol?: string;
    @ApiProperty({required: false})
    readonly cap?: number;
    @ApiProperty({required: false})
    readonly period?: number;
}