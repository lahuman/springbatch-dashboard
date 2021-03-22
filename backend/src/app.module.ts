import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from './batch/batch.module';
import { configService } from './config/config.service';

@Module({
  imports: [ConfigModule.forRoot({  isGlobal: true }), TypeOrmModule.forRoot(configService.getTypeOrmConfig()), BatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
