import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RoomsModule } from '../rooms/rooms.module';
import { ProductTypesModule } from '../product-types/product-types.module';

@Module({ imports: [RoomsModule, ProductTypesModule], providers: [SeedService] })
export class SeedModule {}
