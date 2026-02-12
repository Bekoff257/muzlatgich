import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StorageRecord, StorageRecordSchema } from '../storage-records/storage-record.schema';
import { Debt, DebtSchema } from '../debts/debt.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: StorageRecord.name, schema: StorageRecordSchema }, { name: Debt.name, schema: DebtSchema }])],
  controllers: [StatsController],
  providers: [StatsService]
})
export class StatsModule {}
