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
    readonly minters: string[]; //keep attention it should be length = 3!
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
    readonly minters: string[]; //keep attention it should be length = 3!
    @ApiProperty()
    readonly cap: number;
}