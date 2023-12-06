import { ApiProperty } from "@nestjs/swagger";


export class PublishDataDto{
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly symbol: string;
    @ApiProperty()
    readonly tokenURI: string;
    @ApiProperty()
    readonly transferable: boolean;
}