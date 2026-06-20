import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type ChatSessionDocument = ChatSession & Document;

@Schema({ timestamps: true })
export class ChatSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  repoUrl: string;

  @Prop({ required: false })
  filePath?: string;

  @Prop({ type: [{ role: String, content: String }], default: [] })
  messages: Array<{ role: string; content: string }>;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
