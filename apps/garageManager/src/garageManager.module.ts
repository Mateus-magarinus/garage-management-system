import { Module } from '@nestjs/common';
import { GarageManagerController } from './garageManager.controller';
import { GarageManagerService } from './garageManager.service';
import { GarageManagerRepository } from './garageManager.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import Joi from 'joi';
import {
  GarageManagerDocument,
  GarageManagerSchema,
} from './models/garageManager.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: GarageManagerDocument.name, schema: GarageManagerSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        PAYMENTS_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [GarageManagerController],
  providers: [GarageManagerService, GarageManagerRepository],
})
export class GarageManagerModule {}
