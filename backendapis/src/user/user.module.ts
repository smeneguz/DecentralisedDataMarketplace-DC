import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Customize token expiration
    }),
    BullModule.registerQueue({
      name: 'transactions'
    })
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard, BlockchainService],
  exports: [UserService]
})
export class UserModule {}
