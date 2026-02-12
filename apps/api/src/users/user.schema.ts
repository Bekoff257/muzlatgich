import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  firebaseUid!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ enum: ['ADMIN', 'OPERATOR'], default: 'OPERATOR' })
  role!: 'ADMIN' | 'OPERATOR';
}

export const UserSchema = SchemaFactory.createForClass(User);
