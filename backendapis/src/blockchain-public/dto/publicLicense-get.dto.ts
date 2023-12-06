import { ApiProperty } from "@nestjs/swagger";

export class PublicLicenseDto{
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly symbol: string;
    @ApiProperty()
    readonly licenseType: "usage" | "period";
    @ApiProperty({required: false})
    readonly licensePeriod?: number;
    @ApiProperty()
    readonly price: string; //da vedere se non restituisco un numero, mi sembra strano
    @ApiProperty()
    readonly licenseAddress: string;
}