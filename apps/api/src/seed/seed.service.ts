import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoomsService } from '../rooms/rooms.service';
import { ProductTypesService } from '../product-types/product-types.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly rooms: RoomsService, private readonly productTypes: ProductTypesService) {}

  async onModuleInit() {
    const roomValues = (process.env.SEED_ROOMS || '1-xona,2-xona,3-xona').split(',').map((v) => v.trim()).filter(Boolean);
    const typeValues = (process.env.SEED_PRODUCT_TYPES || 'Shirin,Nordon,Standart').split(',').map((v) => v.trim()).filter(Boolean);
    const existingRooms = await this.rooms.findAll();
    if (!existingRooms.length) for (const name of roomValues) await this.rooms.create(name);
    const existingTypes = await this.productTypes.findAll();
    if (!existingTypes.length) for (const name of typeValues) await this.productTypes.create(name);
  }
}
