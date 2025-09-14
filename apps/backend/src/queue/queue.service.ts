import { Injectable } from '@nestjs/common';
import {InjectQueue} from "@nestjs/bullmq";
import { Queue } from "bullmq"
import {JobDto} from "../jobs/dto/job.dto";

@Injectable()
export class QueueService {
    constructor(@InjectQueue("gp-jobs") private readonly queueService: Queue) {}

    async addJob(agent: string, data: JobDto ) {
        console.log("A new Job is added")
        await this.queueService.add("executor", data, { delay: 2000 })
    }
}
