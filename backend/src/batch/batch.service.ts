import { Injectable } from '@nestjs/common';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchJobInstance } from './entity/jobInstance.entity';
import { BatchJobInstanceRO, BatchJobExecutionRO, ExecuteParam, BatchStepExecutionRO, JobRunningScoreRO, JobDashBoardParam } from './dto/batch.instance';
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
    const whereCondition = this._makeWhereCondition(status, { jobInstanceId: 'DESC' });
    status.name && (whereCondition['where']['jobName'] = Like(`%${status.name}%`));
    status.id && (whereCondition['where']['jobInstanceId'] = status.id);

    const batchJobsInstance = await this.jobInstanceRepository.find(whereCondition);
    return { batchJobsInstance };
  }

  async findJobExecutionAll(jobInstanceId: string, status: ExecuteParam): Promise<BatchJobExecutionRO> {

    const builder = this.jobExecutionRepository.createQueryBuilder("execut")
      .leftJoin("execut.jobInstance", "job")
      .addSelect("job.jobName")
      .addSelect("job.jobInstanceId")
      .where("execut.lastUpdated >= :startDate", { startDate: status.startDate })
      .andWhere("execut.lastUpdated <= concat(:endDate, ' 23:59:59')", { endDate: status.endDate });

    if (status.name) {
      builder.andWhere("job.jobName like :name", { name: `%${status.name}%` });
    }
    if (jobInstanceId) {
      builder.andWhere("job.jobInstanceId = :jobInstanceId", { jobInstanceId });
    }

    if (status.take) {
      builder.take(status.take);
      builder.skip(status.skip);
    }

    const data = await builder.orderBy("execut.lastUpdated", "DESC")
      .getMany();

    return { batchJobExecution: data };
  }

  async findStepExecutionAll(jobExecutionId: string, status: ExecuteParam): Promise<BatchStepExecutionRO> {

    const builder = this.stepExecutionRepository.createQueryBuilder("step")
      .leftJoinAndSelect("step.jobExecution", "execut")
      .leftJoinAndSelect("execut.jobInstance", "job");

    if (status.name) {
      builder.andWhere("step.stepName like :name", { name: `%${status.name}%` });
    }

    if(jobExecutionId){
      builder.andWhere("execut.jobExecutionId = :jobExecutionId", { jobExecutionId });
    }
    if (status.take) {
      builder.take(status.take);
      builder.skip(status.skip);
    }

    const data = await builder.orderBy("step.lastUpdated", "DESC")
      .getMany();

    return { batchStepExecution: data };
  }

  _convertDashboardData(dt): JobRunningScoreRO {
    const data = {
      jobName: dt.job_JOB_NAME,
    };

    dt.execut_STATUS === "FAILED" ? data["failCount"] = dt.statusCnt : data["completCount"] = dt.statusCnt;
    return data;
  }
  _dashboardDataMerge(data): JobRunningScoreRO[] {
    let beforeName = -1;
    return data.reduce((acc, cur) => {
      if (beforeName === cur.job_JOB_NAME) {
        const before = acc.pop();
        acc.push({ ...before, ...this._convertDashboardData(cur) });
      } else {
        acc.push(this._convertDashboardData(cur));
      }
      beforeName = cur.job_JOB_NAME;
      return acc;
    }, []);
  }

  async findDashBoardData(status: JobDashBoardParam): Promise<JobRunningScoreRO[]> {
    const data = await this.jobInstanceRepository.createQueryBuilder("job")
      .select(["job.jobName"])
      .leftJoin("job.batchJobExecution", "execut")
      .addSelect("execut.status")
      .addSelect("COUNT(execut.jobExecutionId)", 'statusCnt')
      .addGroupBy("job.jobName")
      .addGroupBy("execut.status")
      .where("execut.lastUpdated >= :startDate", { startDate: status.startDate })
      .andWhere("execut.lastUpdated <= concat(:endDate, ' 23:59:59')", { endDate: status.endDate })
      .orderBy("job.jobName")
      .getRawMany();

    const result = this._dashboardDataMerge(data);
    return result;
  }
}
