import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Interview extends Document {
  @Prop({ default: uuidv4 })
  sessionId: string;

  @Prop()
  jd: string;

  @Prop()
  cvText: string;

  @Prop([String])
  questions: string[];

  @Prop({ type: Map, of: String })
  answers: Record<string, string>; // question => answer

  @Prop()
  mode: 'basic' | 'advanced' | 'challenge';
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
