import { ApiProperty } from "@nestjs/swagger";

export class ConsumeNftDto{
    @ApiProperty()
    readonly nftAddress: string;
    @ApiProperty()
    readonly licenseAddress: string;
}