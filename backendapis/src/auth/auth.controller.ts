import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentials } from './credentials.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signin')
    async generateJwtToken(@Body() data: { signature: string, publicAddress: string, nonce: string, credentials: Credentials }): Promise<{ accessToken: any }> {
        const accessToken = await this.authService.generateJwtToken(data.signature, data.publicAddress,data.nonce, data.credentials);
        return { accessToken };
    }

    @Post('signup')
    async generateVerifiableCredential(@Body() data: { publicAddress: string, credentials: Credentials }): Promise<{ vcJwt: any }> {
        const vcJwt = await this.authService.generateVerifiableCredential(data.publicAddress, data.credentials);
        return { vcJwt };
    }
}

