import { ApiProperty } from "@nestjs/swagger";

export class LicensePeriodDto{
    @ApiProperty()
    readonly nftAddress: string;
    @ApiProperty()
    readonly price: number;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly symbol: string;
    @ApiProperty()
    readonly minters: string[];
    @ApiProperty()
    readonly cap: number;
    @ApiProperty()
    readonly period: number;
}

export class LicenseUsageDto{
    @ApiProperty()
    readonly nftAddress: string;
    @ApiProperty()
    readonly price: number;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly symbol: string;
    @ApiProperty()
    readonly minters: string[];
    @ApiProperty()
    readonly cap: number;
}