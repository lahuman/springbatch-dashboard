import { Entity, PrimaryColumn, Column,  ManyToOne, JoinColumn} from 'typeorm';
import { BatchStepExecution } from './stepExecution.entity';

@Entity()
export class BatchStepExecutionContext {

  @PrimaryColumn()
  stepExecutionId: number;

  @Column()
  shortContext: string;

  @Column()
  serializedContext: string;

  @ManyToOne(type => BatchStepExecution, stepExecution => stepExecution.stepExecutionId)
  @JoinColumn({name: 'stepExecutionId'})
  stepExecution: BatchStepExecution;
}