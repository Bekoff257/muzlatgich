import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { DebtsService } from './debts.service';

@ApiTags('debts')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('debts')
export class DebtsController {
  constructor(private readonly service: DebtsService) {}

  @Get()
  findAll(@Query() query: any, @Req() req: any) { return this.service.findAll(query, req.user.id); }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.addPayment(id, body, req.user.id);
  }
}
