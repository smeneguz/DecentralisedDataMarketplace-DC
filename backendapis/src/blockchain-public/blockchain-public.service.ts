import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ncrypt from 'ncrypt-js';
import web3Init from '../utils/web.core';
import template721 from '../utils/misc/ERC721template.json'
import template20 from '../utils/misc/ERC20template.json'
import * as dotenv from 'dotenv'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PrismaService } from '../prisma/prisma.service';

dotenv.config()

@Injectable()
export class BlockchainPublicService {
    constructor(/*@InjectRepository(User) private readonly userRepository: Repository<User>*/
        private readonly prisma: PrismaService
    ){
    }

 
}
