
import { ApiProperty } from "@nestjs/swagger";
import { BatchJobExecution } from "../entity/jobExecution.entity";
import { BatchJobInstance } from "../entity/jobInstance.entity";
import { BatchStepExecution } from "../entity/stepExecution.entity";


export interface BatchJobInstanceRO {
  batchJobsInstance: BatchJobInstance[];
}


export interface BatchJobExecutionRO {
  batchJobExecution: BatchJobExecution[];
  totalCount: number;
}

export interface BatchStepExecutionRO {
  batchStepExecution: BatchStepExecution[];
}

export class ExecuteParam {
  @ApiProperty({ required: false })
  status?: string;
  @ApiProperty({ required: false })
  take?: number;
  @ApiProperty({ required: false })
  skip?: number;
}