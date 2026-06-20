import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type RepoDocument = Repo & Document;

@Schema()
export class Repo {
  @Prop()
  repoUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  framework: string;

  @Prop()
  architecture: string;

  @Prop()
  structure: string;

  @Prop()
  analysis: string;

  @Prop()
  diagram: string;
}

export const RepoSchema = SchemaFactory.createForClass(Repo);
