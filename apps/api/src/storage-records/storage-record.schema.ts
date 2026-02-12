import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StorageRecordDocument = HydratedDocument<StorageRecord>;

@Schema({ timestamps: true })
export class StorageRecord {
  @Prop({ required: true }) firstName!: string;
  @Prop({ required: true }) lastName!: string;
  @Prop({ required: true }) phone!: string;
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true }) roomId!: string;
  @Prop({ required: true }) productName!: string;
  @Prop({ type: Types.ObjectId, ref: 'ProductType', required: true }) productTypeId!: string;
  @Prop({ required: true }) kg!: number;
  @Prop({ enum: ['YASHIK', 'QOP', 'KARZINKA'], required: true }) containerType!: 'YASHIK' | 'QOP' | 'KARZINKA';
  @Prop({ required: true }) containerCount!: number;
  @Prop() note?: string;
  @Prop({ required: true }) checkInDate!: Date;
  @Prop({ enum: ['ACTIVE', 'CLOSED', 'DELETED'], default: 'ACTIVE' }) status!: 'ACTIVE' | 'CLOSED' | 'DELETED';
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) createdByUserId!: string;
}

export const StorageRecordSchema = SchemaFactory.createForClass(StorageRecord);
