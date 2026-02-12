import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'StorageRecord' }) storageRecordId!: string;
  @Prop() fullName!: string;
  @Prop() phone!: string;
  @Prop() roomName!: string;
  @Prop() productName!: string;
  @Prop() productTypeName!: string;
  @Prop() kg!: number;
  @Prop({ enum: ['YASHIK', 'QOP', 'KARZINKA'] }) containerType!: string;
  @Prop() containerCount!: number;
  @Prop() checkInDate!: Date;
  @Prop() checkOutDate!: Date;
  @Prop() storedDays!: number;
  @Prop() dailyPricePerKg!: number;
  @Prop() totalSum!: number;
  @Prop({ enum: ['CASH', 'DEBT'] }) paymentType!: 'CASH' | 'DEBT';
  @Prop({ enum: ['PAID', 'UNPAID'], default: 'UNPAID' }) paymentStatus!: 'PAID' | 'UNPAID';
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdByUserId!: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
