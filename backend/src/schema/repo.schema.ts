import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RepoDocument = Repo & Document;

@Schema()
export class Repo {
  @Prop()
  repoUrl: string;

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
