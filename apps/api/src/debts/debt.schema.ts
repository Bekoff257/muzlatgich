import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DebtDocument = HydratedDocument<Debt>;

@Schema({ timestamps: true })
export class Debt {
  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true }) invoiceId!: string;
  @Prop({ required: true }) debtorName!: string;
  @Prop({ required: true }) phone!: string;
  @Prop({ required: true }) amountDue!: number;
  @Prop({ default: 0 }) amountPaid!: number;
  @Prop({ enum: ['UNPAID', 'PARTIAL', 'PAID'], default: 'UNPAID' }) status!: 'UNPAID' | 'PARTIAL' | 'PAID';
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdByUserId!: string;
}

export const DebtSchema = SchemaFactory.createForClass(Debt);
