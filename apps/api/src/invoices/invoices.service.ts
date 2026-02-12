import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ExcelJS from 'exceljs';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private readonly model: Model<InvoiceDocument>) {}

  findAll(query: any) {
    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { productName: { $regex: query.search, $options: 'i' } }
      ];
    }
    if (query.dateFrom || query.dateTo) {
      filter.createdAt = {};
      if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
    }
    return this.model.find(filter).sort({ createdAt: query.sort === 'oldest' ? 1 : -1 });
  }

  async findOne(id: string) {
    const data = await this.model.findById(id);
    if (!data) throw new NotFoundException('Invoice topilmadi');
    return data;
  }

  async exportXlsx(id: string) {
    const invoice = await this.findOne(id);
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Hisob-kitob');
    ws.addRows([
      ['Mijoz', invoice.fullName],
      ['Telefon', invoice.phone],
      ['Xona', invoice.roomName],
      ['Mahsulot', invoice.productName],
      ['Navi', invoice.productTypeName],
      ['Miqdori (kg)', invoice.kg],
      ['Idish turi', invoice.containerType],
      ['Idish soni', invoice.containerCount],
      ['Kiritilgan sana', invoice.checkInDate.toISOString().slice(0, 10)],
      ['Chiqarilgan sana', invoice.checkOutDate.toISOString().slice(0, 10)],
      ['Saqlangan kun', invoice.storedDays],
      ['Kunlik narx', invoice.dailyPricePerKg],
      ['Umumiy summa', invoice.totalSum],
      ['To\'lov turi', invoice.paymentType],
      ['To\'lov holati', invoice.paymentStatus]
    ]);
    return wb.xlsx.writeBuffer();
  }

  markPaid(invoiceId: string) {
    return this.model.findByIdAndUpdate(invoiceId, { paymentStatus: 'PAID' }, { new: true });
  }
}
