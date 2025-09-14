import {Module} from "@nestjs/common";
import {PollingService} from "./polling.service";

@Module({
    providers: [PollingService],
    exports: [PollingService]
})
export class SharedModule {}