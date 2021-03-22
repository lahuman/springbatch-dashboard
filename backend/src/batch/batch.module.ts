import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { BatchJobInstance } from './entity/jobInstance.entity';
import { BatchJobExecution } from './entity/jobExecution.entity';
import { BatchStepExecution } from './entity/stepExecution.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BatchJobInstance, BatchJobExecution, BatchStepExecution])],
  providers: [BatchService],
  controllers: [BatchController]
})
export class BatchModule {}
