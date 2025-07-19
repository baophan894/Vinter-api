import { HydratedDocument } from 'mongoose';
import { Constructor } from './../../../../node_modules/ts-jest/node_modules/type-fest/source/basic.d';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from 'express';

export type UserDocument = HydratedDocument<User>

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
export class User{
    @Prop({ unique: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    googleId: string;

    @Prop()
    photo: string;

	@Prop({ default: 'user', enum: ['User', 'Admin', 'HR'] })
  	role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchemaFactory = () => {
	const userSchema = UserSchema;

	userSchema.pre('findOneAndDelete', async function (next: NextFunction) {
		// OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
		const user = await this.model.findOne(this.getFilter());
		await Promise.all([]);
		return next();
	});
	return userSchema;
};