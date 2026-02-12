import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StorageRecord, StorageRecordDocument } from '../storage-records/storage-record.schema';
import { Debt, DebtDocument } from '../debts/debt.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(StorageRecord.name) private readonly storageModel: Model<StorageRecordDocument>,
    @InjectModel(Debt.name) private readonly debtModel: Model<DebtDocument>
  ) {}

  async summary() {
    const totalActiveClients = await this.storageModel.countDocuments({ status: 'ACTIVE' });
    const totalDebtorsCount = await this.debtModel.countDocuments({ status: { $in: ['UNPAID', 'PARTIAL'] } });
    const kgAgg = await this.storageModel.aggregate([{ $match: { status: 'ACTIVE' } }, { $group: { _id: null, total: { $sum: '$kg' } } }]);

    return { totalActiveClients, totalDebtorsCount, totalKgStoredActive: kgAgg[0]?.total || 0 };
  }
}
