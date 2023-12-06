import { ApiProperty } from "@nestjs/swagger";

export class LicenseUsagePurchaseDto{
    @ApiProperty()
    readonly usage: number;
    @ApiProperty()
    readonly licenseAddress: string;
    @ApiProperty()
    readonly nftAddress: string;
}

export class LicensePeriodPurchaseDto{
    @ApiProperty()
    readonly licenseAddress: string;
    @ApiProperty()
    readonly nftAddress: string;
}