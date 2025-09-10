import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/agents.module';
import { TasksModule } from './tasks/tasks.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [AgentsModule, TasksModule, QueueModule],
})

export class AppModule {}
