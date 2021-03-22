import { Entity, PrimaryColumn, Column,  ManyToOne, JoinColumn} from 'typeorm';
import { BatchJobExecution } from './jobExecution.entity';

@Entity()
export class BatchJobExecutionContext {

  @PrimaryColumn()
  jobExecutionId: number;

  @Column()
  shortContext: string;

  @Column()
  serializedContext: string;

  @ManyToOne(type => BatchJobExecution, jobExecution => jobExecution.jobExecutionId)
  @JoinColumn({name: 'jobExecutionId'})
  jobExecution: BatchJobExecution;
}