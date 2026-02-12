import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StorageRecord, StorageRecordDocument } from './storage-record.schema';
import { Room, RoomDocument } from '../rooms/room.schema';
import { ProductType, ProductTypeDocument } from '../product-types/product-type.schema';
import { Invoice, InvoiceDocument } from '../invoices/invoice.schema';
import { Debt, DebtDocument } from '../debts/debt.schema';

const dayMs = 86400000;
const calcStoredDays = (inDate: Date, outDate: Date) => Math.floor((new Date(outDate).setHours(0,0,0,0) - new Date(inDate).setHours(0,0,0,0)) / dayMs) + 1;

@Injectable()
export class StorageRecordsService {
  constructor(
    @InjectModel(StorageRecord.name) private readonly model: Model<StorageRecordDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(ProductType.name) private readonly productModel: Model<ProductTypeDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Debt.name) private readonly debtModel: Model<DebtDocument>
  ) {}

  create(body: any, userId: string) {
    return this.model.create({ ...body, createdByUserId: userId, status: 'ACTIVE' });
  }

  async findAll(query: any) {
    const filter: any = { status: query.status || 'ACTIVE' };
    if (query.roomId) filter.roomId = query.roomId;
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { productName: { $regex: query.search, $options: 'i' } }
      ];
    }
    return this.model.find(filter).populate('roomId').populate('productTypeId').sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const item = await this.model.findById(id).populate('roomId').populate('productTypeId');
    if (!item) throw new NotFoundException('Topilmadi');
    return item;
  }

  update(id: string, body: any) { return this.model.findByIdAndUpdate(id, body, { new: true }); }
  delete(id: string) { return this.model.findByIdAndUpdate(id, { status: 'DELETED' }, { new: true }); }

  async checkout(id: string, body: { checkOutDate: string; dailyPricePerKg: number; paymentType: 'CASH' | 'DEBT' }, userId: string) {
    const record = await this.model.findById(id);
    if (!record || record.status !== 'ACTIVE') throw new NotFoundException('Aktiv yozuv topilmadi');
    const room = await this.roomModel.findById(record.roomId);
    const product = await this.productModel.findById(record.productTypeId);
    const checkOutDate = new Date(body.checkOutDate);
    const storedDays = Math.max(1, calcStoredDays(record.checkInDate, checkOutDate));
    const totalSum = record.kg * body.dailyPricePerKg * storedDays;

    const invoice = await this.invoiceModel.create({
      storageRecordId: record.id,
      fullName: `${record.firstName} ${record.lastName}`,
      phone: record.phone,
      roomName: room?.name || '',
      productName: record.productName,
      productTypeName: product?.name || '',
      kg: record.kg,
      containerType: record.containerType,
      containerCount: record.containerCount,
      checkInDate: record.checkInDate,
      checkOutDate,
      storedDays,
      dailyPricePerKg: body.dailyPricePerKg,
      totalSum,
      paymentType: body.paymentType,
      paymentStatus: body.paymentType === 'CASH' ? 'PAID' : 'UNPAID',
      createdByUserId: userId
    });

    if (body.paymentType === 'DEBT') {
      await this.debtModel.create({
        invoiceId: invoice.id,
        debtorName: invoice.fullName,
        phone: invoice.phone,
        amountDue: invoice.totalSum,
        amountPaid: 0,
        status: 'UNPAID',
        createdByUserId: userId
      });
    }

    record.status = 'CLOSED';
    await record.save();
    return invoice;
  }
}
