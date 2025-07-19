import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Recruitment>

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Recruitment{
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  requirements: string;

  @Prop()
  benefits: string;

  @Prop()
  deadline: Date;

  @Prop({ required: false })
  createdBy: string; // userId hoặc reference đến User

  @Prop({ default: true })
  isActive: boolean;
}

export const RecruitmentSchema = SchemaFactory.createForClass(Recruitment);

export const RecruitmentSchemaFactory = () => {
    const recruitmentSchema = RecruitmentSchema;

    recruitmentSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const user = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return recruitmentSchema;
};