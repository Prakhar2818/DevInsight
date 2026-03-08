import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ErrorPattern {
  @Prop()
  error: string;

  @Prop()
  cause: string;

  @Prop()
  solution: string;
}

export const ErrorPatternSchema = SchemaFactory.createForClass(ErrorPattern);
