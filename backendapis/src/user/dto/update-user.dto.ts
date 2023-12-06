import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto{
    @ApiProperty()
    readonly password_old: string;
    @ApiProperty()
    readonly password_new: string;
}

export class UpdateUsernameDto{
    @ApiProperty()
    readonly username_old: string;
    @ApiProperty()
    readonly username_new: string;
}