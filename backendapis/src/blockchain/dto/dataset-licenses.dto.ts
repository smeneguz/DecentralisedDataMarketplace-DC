import { ApiProperty } from '@nestjs/swagger';

export class DatasetLicenseDto{
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly symbol: string;
    @ApiProperty()
    readonly type: string;
    @ApiProperty({required: false})
    readonly periodMonth?: number;
    @ApiProperty()
    readonly price: string;
    @ApiProperty()
    readonly address: string; 
}