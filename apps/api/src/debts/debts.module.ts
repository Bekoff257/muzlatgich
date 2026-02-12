import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Debt, DebtSchema } from './debt.schema';
import { Payment, PaymentSchema } from './payment.schema';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Debt.name, schema: DebtSchema }, { name: Payment.name, schema: PaymentSchema }]), InvoicesModule],
  providers: [DebtsService],
  controllers: [DebtsController]
})
export class DebtsModule {}
