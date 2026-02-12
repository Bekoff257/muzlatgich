import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { StorageRecordsModule } from './storage-records/storage-records.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DebtsModule } from './debts/debts.module';
import { StatsModule } from './stats/stats.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.getOrThrow<string>('MONGO_URL') })
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    ProductTypesModule,
    StorageRecordsModule,
    InvoicesModule,
    DebtsModule,
    StatsModule,
    SeedModule
  ]
})
export class AppModule {}
