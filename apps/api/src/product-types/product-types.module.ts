import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductType, ProductTypeSchema } from './product-type.schema';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductType.name, schema: ProductTypeSchema }])],
  providers: [ProductTypesService],
  controllers: [ProductTypesController],
  exports: [ProductTypesService, MongooseModule]
})
export class ProductTypesModule {}
