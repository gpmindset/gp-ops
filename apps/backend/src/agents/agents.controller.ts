import {Controller, Post} from '@nestjs/common';
import { AgentsService } from './agents.service';
import {RegisterAgentDto} from "./dto/agents.dto";

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  async registerAgent(agent: RegisterAgentDto) {
    return await this.agentsService.registerAgent(agent);
  }
}
