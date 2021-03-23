import { Injectable } from '@nestjs/common';
import { Repository, getRepository, DeleteResult, FindManyOptions } from 'typeorm';
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

  _makeWhereCondition(status: ExecuteParam, order?: any): FindManyOptions {
    const whereCondition = { where: {} };
    if (status.status) {
      whereCondition['where']['status'] = status.status;
    }
    if (status.take) {
      whereCondition['take'] = status.take;
      whereCondition['skip'] = status.skip;
    }
    if (order) {
      whereCondition['order'] = order;
    }
    return whereCondition;
  }
  async findJobInstanceAll(status: ExecuteParam): Promise<BatchJobInstanceRO> {
    const batchJobsInstance = await this.jobInstanceRepository.find(this._makeWhereCondition(status));
    return { batchJobsInstance };
  }

  async findJobExecutionAll(jobInstanceId: string, status: ExecuteParam): Promise<BatchJobExecutionRO> {
    const whereCondition = this._makeWhereCondition(status, { lastUpdated: 'DESC' });
    whereCondition['where']['jobInstanceId'] = jobInstanceId;

    const batchJobExecution = await this.jobExecutionRepository.find(whereCondition);
    return { batchJobExecution };
  }

  async findStepExecutionAll(jobExecutionId: string, status: ExecuteParam): Promise<BatchStepExecutionRO> {
    const whereCondition = this._makeWhereCondition(status, { lastUpdated: 'ASC' });
    whereCondition['where']['jobExecutionId'] = jobExecutionId;

    const batchStepExecution = await this.stepExecutionRepository.find(whereCondition);
    return { batchStepExecution };
  }

}
