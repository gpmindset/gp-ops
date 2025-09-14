import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";


export type AgentsDocument = HydratedDocument<Agents>

@Schema({ timestamps: true })
export class Agents {
    @Prop()
    agentId: string;

    @Prop()
    name: string;

    @Prop()
    platform: string;

    @Prop()
    release: string;

    @Prop()
    architecture: string;
}

export const AgentsSchema = SchemaFactory.createForClass(Agents)