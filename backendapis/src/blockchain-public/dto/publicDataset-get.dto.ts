import { ApiProperty } from "@nestjs/swagger";

export class PublicDatasetDto{
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly symbol: string;
    @ApiProperty()
    readonly ownerAddress: string;
    @ApiProperty()
    readonly getTokenUri: string;
    @ApiProperty()
    readonly nftAddress: string;
}