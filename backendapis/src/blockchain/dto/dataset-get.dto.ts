import { ApiProperty } from '@nestjs/swagger';

export class GetDatasetServiceUploaded{
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
    @ApiProperty()
    readonly transferable: boolean;
}