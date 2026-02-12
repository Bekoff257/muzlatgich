import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { StorageRecordsService } from './storage-records.service';

@ApiTags('storage-records')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('storage-records')
export class StorageRecordsController {
  constructor(private readonly service: StorageRecordsService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) { return this.service.create(body, req.user.id); }

  @Get()
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.delete(id); }

  @Post(':id/checkout')
  checkout(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.checkout(id, body, req.user.id);
  }
}
