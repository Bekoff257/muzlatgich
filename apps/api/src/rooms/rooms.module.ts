import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService, MongooseModule]
})
export class RoomsModule {}
