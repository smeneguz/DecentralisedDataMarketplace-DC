import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Get Access Token' })
  @ApiResponse({status: 201, description: 'User DataSets or Services Licenses', schema:{
    type: 'object',
    properties: {
      access_token: {
        type: 'string'
      }
    },
    required: ["access_token"]
  }})
  @Post('login')
  signIn(@Body() signInDto: CreateUserDto): Promise<{access_token: string}> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
