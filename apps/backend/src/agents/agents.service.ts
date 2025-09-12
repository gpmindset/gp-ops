import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Agents, AgentsDocument} from "./schemas/agents.schema";
import {Model} from "mongoose";
import {RegisterAgentDto} from "./dto/agents.dto";

@Injectable()
export class AgentsService {

  constructor(@InjectModel(Agents.name)private readonly agentModel: Model<AgentsDocument>) {}

  async registerAgent(agent: RegisterAgentDto) {
    const findDuplicate = await this.agentModel.findOne({ agentId: agent.id });
    if (findDuplicate) {
      return agent;
    }

    const newAgent = new this.agentModel({
                agentId: agent.id,
                name: agent.name,
                platform: agent.platform,
                release: agent.release,
                architecture: agent.architecture
              });
    return newAgent.save();
  }

}
