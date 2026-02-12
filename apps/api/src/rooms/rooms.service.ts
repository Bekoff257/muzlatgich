import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './room.schema';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>) {}
  findAll() { return this.roomModel.find().sort({ name: 1 }); }
  create(name: string) { return this.roomModel.create({ name }); }
}
