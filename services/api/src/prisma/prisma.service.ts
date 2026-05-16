import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { createClient, Client } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private libsql: Client;

  constructor() {
    const libsql = createClient({ url: 'file:./dev.db' });
    const adapter = new PrismaLibSql(libsql as any);
    super({ adapter });
    this.libsql = libsql;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.libsql.close();
  }
}
