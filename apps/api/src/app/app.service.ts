import { Injectable } from '@nestjs/common';
import { Message } from '@quadrant-biosciences/api-interfaces';

import { PrismaClient } from '@prisma/client';
@Injectable()
export class AppService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
