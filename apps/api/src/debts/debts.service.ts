import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Debt, DebtDocument } from './debt.schema';
import { Payment, PaymentDocument } from './payment.schema';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debt.name) private readonly debtModel: Model<DebtDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly invoicesService: InvoicesService
  ) {}

  findAll(query: any, currentUserId: string) {
    const filter: any = {};
    if (query.status) filter.status = query.status;
    if (query.mine === 'true') filter.createdByUserId = currentUserId;
    if (query.search) filter.$or = [{ debtorName: { $regex: query.search, $options: 'i' } }, { phone: { $regex: query.search, $options: 'i' } }];
    return this.debtModel.find(filter).sort({ createdAt: -1 });
  }

  async addPayment(id: string, body: { amount: number; method: 'CASH' | 'TRANSFER'; note?: string }, userId: string) {
    const debt = await this.debtModel.findById(id);
    if (!debt) throw new NotFoundException('Qarz topilmadi');

    await this.paymentModel.create({ debtId: id, ...body, createdByUserId: userId });
    debt.amountPaid += body.amount;
    const remaining = debt.amountDue - debt.amountPaid;
    debt.status = remaining <= 0 ? 'PAID' : debt.amountPaid > 0 ? 'PARTIAL' : 'UNPAID';
    await debt.save();

    if (debt.status === 'PAID') await this.invoicesService.markPaid(debt.invoiceId);

    return { debt, remaining: Math.max(0, remaining) };
  }
}
