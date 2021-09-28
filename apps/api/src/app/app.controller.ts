import { User } from '.prisma/client';
import { Controller, Get } from '@nestjs/common';

import { PrismaService } from './services/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prismaService: PrismaService) { }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }
}
