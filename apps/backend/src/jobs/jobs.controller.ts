import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {JobDto} from "./dto/job.dto";
import { randomUUID } from "crypto"
import type { Response } from "express"
import {PollingService} from "../shared/polling.service";

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService, private readonly pollingService: PollingService) {}

  @Post()
  async createJob(@Body() job: JobDto) {
    job.jobId = randomUUID()
    return await this.jobsService.createJob(job)
  }

  @Post("poll")
  async pollJob(@Body('agentId') agentId: string, @Res() res: Response) {
    this.pollingService.setPendingRequests(agentId, res);

    setTimeout(() => {
      const pendingRes = this.pollingService.getAndClearPendingRequests(agentId);
      if (pendingRes) {
        pendingRes.status(HttpStatus.NO_CONTENT).send()
      }
    }, 55000)
  }

  @Post("logs")
  async receiveLogs(@Body() body: any) {
    const { agentId, jobId, type, data } = body
    console.log(`[${agentId}] Log for job ${jobId} (${type}): ${data}`)
  }

}
