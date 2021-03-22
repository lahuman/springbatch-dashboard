import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BatchJobExecutionRO, BatchJobInstanceRO, BatchStepExecutionRO, ExecuteParam } from './dto/batch.instance';
import { BatchService } from './batch.service';

@Controller('batch')
@ApiTags("batch")
export class BatchController {

  constructor(private readonly batchService: BatchService) { }

  @ApiOperation({ summary: 'Get all job instance' })
  @ApiResponse({ status: 200, description: 'Return all job instance.' })
  @Get("jobInstances")
  async findJobInstanceAll(@Query() query): Promise<BatchJobInstanceRO> {
    return await this.batchService.findJobInstanceAll(query);
  }

  @ApiOperation({ summary: 'Get all job execution by job instance' })
  @ApiResponse({ status: 200, description: 'Return all job execution.' })
  @Get("jobExecution/:jobInstanceId")
  async findJobExecutionAll(@Param("jobInstanceId") jobInstanceId: string, @Query() status: ExecuteParam): Promise<BatchJobExecutionRO> {
    return await this.batchService.findJobExecutionAll(jobInstanceId, status);
  }

  @ApiOperation({ summary: 'Get all job execution by job execution' })
  @ApiResponse({ status: 200, description: 'Return all step execution.' })
  @Get("stepExecution/:jobExecutionId")
  async findStepExecutionAll(@Param("jobExecutionId") jobInstanceId: string, @Query() status: ExecuteParam): Promise<BatchStepExecutionRO> {
    return await this.batchService.findStepExecutionAll(jobInstanceId, status);
  }


}
