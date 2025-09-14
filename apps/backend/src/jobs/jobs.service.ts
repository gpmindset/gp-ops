import { Injectable } from '@nestjs/common';
import {InjectQueue} from "@nestjs/bullmq";
import {QueueService} from "../queue/queue.service";
import {InjectModel} from "@nestjs/mongoose";
import {JobDocument, Jobs} from "./schemas/job.schema";
import {Model} from "mongoose";
import {JobDto} from "./dto/job.dto";

@Injectable()
export class JobsService {
    constructor(private readonly queueService: QueueService,
                @InjectModel(Jobs.name) private readonly jobModel: Model<JobDocument>) {}

    async createJob(job: JobDto) {
        const newJob = new this.jobModel(job)
        await newJob.save();

        await this.queueService.addJob(job.agentId, job)
    }

}
