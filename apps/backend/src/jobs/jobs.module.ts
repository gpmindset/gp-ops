import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import {QueueModule} from "../queue/queue.module";
import {MongooseModule} from "@nestjs/mongoose";
import {JobsSchema, Jobs} from "./schemas/job.schema";
import {SharedModule} from "../shared/shared.module";
import {JobsController} from "./jobs.controller";

@Module({
  imports: [QueueModule, MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]), SharedModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
