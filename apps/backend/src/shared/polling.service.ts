import {Injectable} from "@nestjs/common";
import { Response } from "express"

@Injectable()
export class PollingService {
    private readonly polledRequests = new Map<string, Response>

    setPendingRequests(agentId: string, res: Response) {
        this.polledRequests.set(agentId, res)
    }

    getAndClearPendingRequests(agentId: string) {
       const res = this.polledRequests.get(agentId)
        if (res) {
            this.polledRequests.delete(agentId)
        }
        return res
    }
}