import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BullModule } from '@nestjs/bull';
import { ReportQueueConsumer } from 'src/blockchain/report-queue.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { BlockchainController } from './blockchain.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[
    PrismaModule,
    BullModule.registerQueue({
      name: 'transactions'
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Customize token expiration
    }),
    //TypeOrmModule.forFeature([User])
  ],
  providers: [BlockchainService, AuthGuard, PrismaService, ReportQueueConsumer],
  exports: [BlockchainService],
  controllers: [BlockchainController]
})
export class BlockchainModule {}
