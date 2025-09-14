import {Body, Controller, Post} from '@nestjs/common';
import { AgentsService } from './agents.service';
import {RegisterAgentDto} from "./dto/agents.dto";

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  async registerAgent(@Body() agent: RegisterAgentDto) {
    console.log(agent, "Agent");
    return await this.agentsService.registerAgent(agent);
  }
}
