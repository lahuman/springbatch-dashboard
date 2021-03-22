import { Injectable } from '@nestjs/common';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchJobInstance } from './entity/jobInstance.entity';
import { BatchJobInstanceRO, BatchJobExecutionRO, ExecuteParam, BatchStepExecutionRO } from './dto/batch.instance';
import { BatchJobExecution } from './entity/jobExecution.entity';
import { BatchStepExecution } from './entity/stepExecution.entity';


@Injectable()
export class BatchService {

  constructor(
    @InjectRepository(BatchJobInstance)
    private readonly jobInstanceRepository: Repository<BatchJobInstance>,
    @InjectRepository(BatchJobExecution)
    private readonly jobExecutionRepository: Repository<BatchJobExecution>,
    @InjectRepository(BatchStepExecution)
    private readonly stepExecutionRepository: Repository<BatchStepExecution>,
  ) { }

  async findJobInstanceAll(query): Promise<BatchJobInstanceRO> {
    const batchJobsInstance = await this.jobInstanceRepository.find();
    return { batchJobsInstance };
  }

  async findJobExecutionAll(jobInstanceId: string, status: ExecuteParam): Promise<BatchJobExecutionRO> {
    const whereCondition = { where: { jobInstanceId }};
    if (status.status) {
      whereCondition['where']['status'] = status.status;
    }
    if (status.take) {
      whereCondition['take'] = status.take;
      whereCondition['skip'] = status.skip;
    }
    whereCondition['order'] = {lastUpdated: 'DESC'};

    const [batchJobExecution, totalCount] = await this.jobExecutionRepository.findAndCount(whereCondition);
    return { batchJobExecution, totalCount };
  }

  async findStepExecutionAll(jobExecutionId: string, status: ExecuteParam): Promise<BatchStepExecutionRO> {
    const whereCondition = { where: { jobExecutionId } };
    if (status.status) {
      whereCondition['where']['status'] = status.status;
    }

    whereCondition['order'] = {lastUpdated: 'ASC'};
    const batchStepExecution = await this.stepExecutionRepository.find(whereCondition);
    return { batchStepExecution };
  }

}
