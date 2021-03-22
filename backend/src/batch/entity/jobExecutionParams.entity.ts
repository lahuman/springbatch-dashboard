import { Entity, PrimaryColumn, Column,  ManyToOne, JoinColumn} from 'typeorm';
import { BatchJobExecution } from './jobExecution.entity';

@Entity()
export class BatchJobExecutionParams {

  @PrimaryColumn()
  jobExecutionId: number;

  @Column()
  typeCd: string;

  @Column()
  keyName: string;

  @Column()
  stringVal: string;

  @Column()
  dateVal: Date;

  @Column()
  longVal: number;
  
  @Column()
  doubleVal: number;

  @Column()
  Identifying: string;

  @ManyToOne(type => BatchJobExecution, jobExecution => jobExecution.jobExecutionId)
  @JoinColumn({name: 'jobExecutionId'})
  jobExecution: BatchJobExecution;
}