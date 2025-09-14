import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/agents.module';
import { QueueModule } from './queue/queue.module';
import { DbModule } from './db/db.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [QueueModule, JobsModule, AgentsModule, DbModule],
})

export class AppModule {}
