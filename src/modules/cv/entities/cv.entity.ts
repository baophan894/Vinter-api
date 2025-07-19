import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';

export type CvDocument = HydratedDocument<Cv>

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

export class Cv {

    @Prop({ required: true })
    filename: string;

   @Prop({ required: true })
    url: string;

    @Prop({ type: String })
    content: string;
}

export const CvSchema = SchemaFactory.createForClass(Cv);

export const CvSchemaFactory = () => {
    const cvSchema = CvSchema;

    cvSchema.pre('findOneAndDelete', async function (next: NextFunction) {
        // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
        const user = await this.model.findOne(this.getFilter());
        await Promise.all([]);
        return next();
    });
    return cvSchema;
};