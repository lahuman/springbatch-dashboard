import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BatchJobExecutionRO, BatchJobInstanceRO, BatchStepExecutionRO, ExecuteParam, JobDashBoardParam, JobRunningScoreRO } from './dto/batch.instance';
import { BatchService } from './batch.service';

@Controller('batch')
@ApiTags("batch")
export class BatchController {

  constructor(private readonly batchService: BatchService) { }

  @ApiOperation({ summary: 'Get all job instance' })
  @ApiResponse({ status: 200, description: 'Return all job instance.', type: BatchJobInstanceRO })
  @Get("jobInstances")
  async findJobInstanceAll(@Query() query: ExecuteParam): Promise<BatchJobInstanceRO> {
    return await this.batchService.findJobInstanceAll(query);
  }

  @ApiOperation({ summary: 'Get all job execution by job instance' })
  @ApiResponse({ status: 200, description: 'Return all job execution.', type: BatchJobExecutionRO })
  @Get("jobExecution/:jobInstanceId?")
  async findJobExecutionAll(@Param("jobInstanceId") jobInstanceId: string, @Query() status: ExecuteParam): Promise<BatchJobExecutionRO> {
    return await this.batchService.findJobExecutionAll(jobInstanceId, status);
  }

  @ApiOperation({ summary: 'Get all job execution by job execution' })
  @ApiResponse({ status: 200, description: 'Return all step execution.', type: BatchStepExecutionRO })
  @Get("stepExecution/:jobExecutionId?")
  async findStepExecutionAll(@Param("jobExecutionId") jobInstanceId: string, @Query() status: ExecuteParam): Promise<BatchStepExecutionRO> {
    return await this.batchService.findStepExecutionAll(jobInstanceId, status);
  }

  @ApiOperation({ summary: 'Get Dashboard' })
  @ApiResponse({ status: 200, description: 'Return dashboard data', type: JobRunningScoreRO, isArray: true })
  @Get("dashBoard")
  async Dashboard(@Query() status: JobDashBoardParam): Promise<JobRunningScoreRO[]> {
    return await this.batchService.findDashBoardData(status);
  }

}
