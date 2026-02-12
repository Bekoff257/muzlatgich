import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Debt', required: true }) debtId!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ enum: ['CASH', 'TRANSFER'], required: true }) method!: 'CASH' | 'TRANSFER';
  @Prop() note?: string;
  @Prop({ default: Date.now }) paidAt!: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdByUserId!: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
