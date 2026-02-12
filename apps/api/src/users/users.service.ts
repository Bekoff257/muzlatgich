import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async getOrCreateFromFirebase(decoded: { uid: string; email?: string; phone_number?: string; name?: string }) {
    let user = await this.userModel.findOne({ firebaseUid: decoded.uid });
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!user) {
      user = await this.userModel.create({
        firebaseUid: decoded.uid,
        name: decoded.name || decoded.email || decoded.phone_number || 'Foydalanuvchi',
        email: decoded.email,
        phone: decoded.phone_number,
        role: adminEmail && decoded.email?.toLowerCase() === adminEmail ? 'ADMIN' : 'OPERATOR'
      });
    }
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
  }
}
