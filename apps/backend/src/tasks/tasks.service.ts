import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {QueueService} from "../queue/queue.service";

@Injectable()
export class TasksService {

  constructor(private readonly queueService: QueueService) {}

  async create(createTaskDto: CreateTaskDto) {
    await this.queueService.addJob("agent-1",{
      jobId: "ec2-1",
      exec: "shell commands"
    })
    return {
      message: "Job done"
    };
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
