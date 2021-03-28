import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BatchJobExecution } from './jobExecution.entity';
import { BatchStepExecutionContext } from './stepExecutionContext.entity';

@Entity()
export class BatchStepExecution {

  @PrimaryColumn()
  stepExecutionId: number;

  @Column()
  version: number;

  @Column()
  stepName: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  status: string;

  @Column()
  commitCount: number;

  @Column()
  readCount: number;

  @Column()
  filterCount: number;

  @Column()
  writeCount: number;

  @Column()
  readSkipCount: number;

  @Column()
  writeSkipCount: number;

  @Column()
  processSkipCount: number;

  @Column()
  rollbackCount: number;

  @Column()
  exitCode: string;

  @Column()
  exitMessage: string;

  @Column()
  lastUpdated: Date;

  @ManyToOne(type => BatchJobExecution, job => job.stepExecution)
  @JoinColumn({ name: 'jobExecutionId' },)
  jobExecution: BatchJobExecution;


  @OneToMany(type => BatchStepExecutionContext, stepExecutionContext => stepExecutionContext.stepExecution)
  @JoinColumn({ name: 'stepExecutionId' })
  stepExecutionContext: Promise<BatchStepExecutionContext[]>;
}