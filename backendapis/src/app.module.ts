import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { BullModule } from '@nestjs/bull';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { BlockchainPublicModule } from './blockchain-public/blockchain-public.module';

require('dotenv').config()

@Module({
  imports: [
    /*
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080',
      realm: 'datacellar-users',
      clientId: 'my-client-id',
      secret: 'my-client-secret',
    }),
    */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      entities: [User],
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: true,
  }),
  BullModule.forRoot({
    redis: {
      host: '127.0.0.1',
      port: 6379,
    }
  }),
  UserModule,
  AuthModule,
  BlockchainModule,
  BlockchainPublicModule],
  controllers: [AppController],
  providers: [
    AppService,
    /*
    {
      provide: APP_GUARD,     
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    */
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
