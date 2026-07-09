import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TraceCacheDocument = TraceCache & Document;

@Schema({ timestamps: true })
export class TraceCache {
  @Prop({ required: true, unique: true, index: true })
  queryHash: string;

  @Prop({ required: true, type: Object })
  result: any;
}

export const TraceCacheSchema = SchemaFactory.createForClass(TraceCache);
