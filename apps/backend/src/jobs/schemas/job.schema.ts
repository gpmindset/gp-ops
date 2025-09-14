import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";


export type JobDocument = HydratedDocument<Jobs>

@Schema({timestamps: true})
export class Jobs {
    @Prop()
    jobId: string;

    @Prop()
    agentId: string;

    @Prop()
    type: string;

    @Prop()
    commands: string[];

    @Prop({ default: "queued" })
    status: string;

}

export const JobsSchema = SchemaFactory.createForClass(Jobs)