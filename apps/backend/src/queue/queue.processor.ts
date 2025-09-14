import {Processor, WorkerHost} from "@nestjs/bullmq";
import { Job } from "bullmq";
import {PollingService} from "../shared/polling.service";
import {HttpStatus} from "@nestjs/common";

@Processor("gp-jobs")
export class QueueProcessor extends WorkerHost {
    constructor(private pollingService: PollingService) {
        super();
    }
    process(job: Job): Promise<any> {
        const { agentId } = job.data
        console.log(`Processing job ${job.id} on agent ${agentId}`)

        const res = this.pollingService.getAndClearPendingRequests(agentId);
        if (res) {
            res.status(HttpStatus.OK).send({ jobId: job.id, data: job.data });
        } else {
            console.log(`Agent ${agentId} is not polling, job ${job.id} will picked up on next poll`);
        }
        return Promise.resolve(job);
    }
}