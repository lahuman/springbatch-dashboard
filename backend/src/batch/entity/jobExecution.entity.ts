import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BatchJobExecutionContext } from './jobExecutionContext.entity';
import { BatchJobExecutionParams } from './jobExecutionParams.entity';
import { BatchJobInstance } from './jobInstance.entity';
import { BatchStepExecution } from './stepExecution.entity';

@Entity()
export class BatchJobExecution {

  @PrimaryColumn()
  jobExecutionId: number;

  @Column()
  version: number;

  @Column()
  jobInstanceId: number;

  @Column()
  createTime: Date;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;
  
  @Column()
  status: string;

  @Column()
  exitCode: string;

  @Column()
  exitMessage: string;

  @Column()
  lastUpdated: Date;

  @ManyToOne(type => BatchJobInstance, job => job.batchJobExecution)
  @JoinColumn({name: 'jobInstanceId'})
  jobInstance: BatchJobInstance;

  @OneToMany(type => BatchJobExecutionParams, jobExecutionParams => jobExecutionParams.jobExecution)
  @JoinColumn({name: 'jobExecutionId'})
  jobExecutionParams: Promise<BatchJobExecutionParams[]>;
  
  @OneToMany(type => BatchJobExecutionContext, jobExecutionContext => jobExecutionContext.jobExecution)
  @JoinColumn({name: 'jobExecutionId'})
  jobExecutionContext: Promise<BatchJobExecutionContext[]>;
  
  @OneToMany(type => BatchStepExecution, stepExecution => stepExecution.jobExecution)
  @JoinColumn({name: 'jobExecutionId'})
  stepExecution: Promise<BatchStepExecution[]>;
}