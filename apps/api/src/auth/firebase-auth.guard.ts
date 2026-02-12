import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getFirebaseAuth } from './firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException('Token topilmadi');

    const token = authHeader.slice(7);
    try {
      const decoded = await getFirebaseAuth().verifyIdToken(token);
      const profile = await this.usersService.getOrCreateFromFirebase(decoded);
      req.user = profile;
      return true;
    } catch {
      throw new UnauthorizedException('Token yaroqsiz');
    }
  }
}
