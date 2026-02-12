import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductTypeDocument = HydratedDocument<ProductType>;

@Schema({ timestamps: true })
export class ProductType {
  @Prop({ required: true, unique: true })
  name!: string;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
