import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule
            .forRoot("mongodb+srv://sgprakas:San2000@sgprakas.hoeqbig.mongodb.net/gp-ops?retryWrites=true&w=majority&appName=sgprakas")
    ]
})
export class DbModule {}
