import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('me')
export class UsersController {
  @Get()
  @UseGuards(FirebaseAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }
}
