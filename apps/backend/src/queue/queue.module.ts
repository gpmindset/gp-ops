import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import {BullModule} from "@nestjs/bullmq";
import {QueueProcessor} from "./queue.processor";
import {SharedModule} from "../shared/shared.module";

@Module({
  imports: [
      BullModule.forRoot({
        connection: {
          host: 'redis-18391.c257.us-east-1-3.ec2.redns.redis-cloud.com',
          port: 18391,
            password: "ZIJCBFge1nk58B5J5yhOT9l8Qglmv0Bg"
        }
      }),
      BullModule.registerQueue({ name: "gp-jobs" }),
      SharedModule
  ],
  providers: [QueueService, QueueProcessor],
    exports: [QueueService]
})
export class QueueModule {}
