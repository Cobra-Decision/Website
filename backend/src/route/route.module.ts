import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteRepository } from './route.repository';
import { RouteController } from './route.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RouteController],
  providers: [RouteService, RouteRepository],
  exports: [RouteService],
  imports: [PrismaModule],
})
export class RouteModule {}
