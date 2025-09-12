import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Agents, AgentsSchema} from "./schemas/agents.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Agents.name, schema: AgentsSchema }])],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
