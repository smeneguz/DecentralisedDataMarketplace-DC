import { Module } from '@nestjs/common';
import { BlockchainPublicService } from './blockchain-public.service';
import { BlockchainPublicController } from './blockchain-public.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Customize token expiration
   }),
   //TypeOrmModule.forFeature([User]),
   PrismaModule
  ],
  providers: [BlockchainPublicService, AuthGuard, PrismaService],
  controllers: [BlockchainPublicController]
})
export class BlockchainPublicModule {}
