
import { ApiProperty } from "@nestjs/swagger";
import { BatchJobExecution } from "../entity/jobExecution.entity";
import { BatchJobInstance } from "../entity/jobInstance.entity";
import { BatchStepExecution } from "../entity/stepExecution.entity";


export class BatchJobInstanceRO {
  @ApiProperty({ required: true, isArray: true, type: BatchJobInstance })
  batchJobsInstance: BatchJobInstance[];
}


export class BatchJobExecutionRO {
  @ApiProperty({ required: true, isArray: true, type: BatchJobExecution })
  batchJobExecution: BatchJobExecution[];
}

export class BatchStepExecutionRO {
  @ApiProperty({ required: true, isArray: true, type: BatchStepExecution })
  batchStepExecution: BatchStepExecution[];
}

export class ExecuteParam {
  @ApiProperty({ required: false })
  status?: string;
  @ApiProperty({ required: false })
  take?: number;
  @ApiProperty({ required: false })
  skip?: number;
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  id?: string;
}

export class JobDashBoardParam {
  @ApiProperty({ required: true })
  startDate: string;
  @ApiProperty({ required: true })
  endDate: string;
}

export class JobRunningScoreRO {
  @ApiProperty({ required: true })
  jobName: string;
  @ApiProperty({ required: false })
  failCount?: string
  @ApiProperty({ required: false })
  completCount?: string
}