import { Injectable } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as dotenv from "dotenv";
import { BlockchainService } from 'src/blockchain/blockchain.service';
import bcrypt from 'bcrypt'
import { LoggerCustom } from 'src/logger/logger';

dotenv.config();


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly blockchainService: BlockchainService
  ) {}

  private readonly logger = LoggerCustom();

  async signup(username: string, password: string): Promise<any> {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      this.logger.error('Username already exists')
      throw new Error('Username already exists');
    }
    const user = new User();
    user.username = username;
    user.password = password;
    try{
      return await this.blockchainService.newUserOnBlockchain(user);
    } catch(error: any){
      return error;
    }
  }

  /*async updatePassword(updatePassword: UpdatePasswordDto, username: string): Promise<Boolean>{
    const user = await this.userRepository.findOne({where: {username}})
    if (!user){
      throw Error('Header Error!')
    }
    const success = await bcrypt.compare(updatePassword.password_old, user.password);
    if(!success){
      throw Error('Old password wrong!');
    }
    const hashedPassword = await bcrypt.hash(updatePassword.password_new, 10);
    try{
    await this.userRepository.update(user.id, {password: hashedPassword});
    } catch(error: any){
      throw Error('Database Operation Error');
    }
    return true;
  }*/

  async getAddressAndKey(username: string){
    const user = await this.userRepository.findOne({where: {username}})
    if (!user){
      throw Error('Header Error!')
    }
    return {
      address: user.address, key: user.privateKey
    }
 }

  async findOne(username: string): Promise<any>{
    const res = await this.userRepository.findOne({ where: { username } })
    if(res){
      return res;
    } else {
      return false;
    }
  }
}
