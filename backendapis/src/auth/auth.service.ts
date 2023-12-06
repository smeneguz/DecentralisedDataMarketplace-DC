import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const success = await bcrypt.compare(pass, user.password)
    if (!user || !success) {
      throw new UnauthorizedException();
    }
    const payload = {sub: user.id, username: user.username}
    return {
        access_token: await this.jwtService.signAsync(payload)
    }
  }

}