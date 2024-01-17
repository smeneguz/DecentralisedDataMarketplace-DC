import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
import { PrismaService } from '../prisma/prisma.service';


dotenv.config();


@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService
  ) {}



}
