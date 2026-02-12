import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductType, ProductTypeDocument } from './product-type.schema';

@Injectable()
export class ProductTypesService {
  constructor(@InjectModel(ProductType.name) private readonly productTypeModel: Model<ProductTypeDocument>) {}
  findAll() { return this.productTypeModel.find().sort({ name: 1 }); }
  create(name: string) { return this.productTypeModel.create({ name }); }
}
