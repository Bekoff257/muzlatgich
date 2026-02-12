import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageRecord, StorageRecordSchema } from './storage-record.schema';
import { StorageRecordsService } from './storage-records.service';
import { StorageRecordsController } from './storage-records.controller';
import { Room, RoomSchema } from '../rooms/room.schema';
import { ProductType, ProductTypeSchema } from '../product-types/product-type.schema';
import { Invoice, InvoiceSchema } from '../invoices/invoice.schema';
import { Debt, DebtSchema } from '../debts/debt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StorageRecord.name, schema: StorageRecordSchema },
      { name: Room.name, schema: RoomSchema },
      { name: ProductType.name, schema: ProductTypeSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Debt.name, schema: DebtSchema }
    ])
  ],
  providers: [StorageRecordsService],
  controllers: [StorageRecordsController],
  exports: [MongooseModule]
})
export class StorageRecordsModule {}
