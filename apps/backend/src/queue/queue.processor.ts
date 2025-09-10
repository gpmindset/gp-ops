import {Processor, WorkerHost} from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor("gp-jobs")
export class QueueProcessor extends WorkerHost {
    process(job: Job): Promise<any> {
        console.log(job.data)
        console.log("Job finished")
        return Promise.resolve(job.data)
    }
}