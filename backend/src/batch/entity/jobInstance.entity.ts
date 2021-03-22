import { Entity, PrimaryColumn, Column,OneToMany, JoinColumn } from 'typeorm';
import { BatchJobExecution } from './jobExecution.entity';

@Entity()
export class BatchJobInstance {

  @PrimaryColumn()
  jobInstanceId: number;

  @Column()
  version: number;

  @Column()
  jobName: string;

  @Column()
  jobKey: string;

  @OneToMany(type => BatchJobExecution, jobExecution => jobExecution.jobInstance)
  @JoinColumn({name: 'jobInstanceId'})
  batchJobExecution: Promise<BatchJobExecution[]>;
}