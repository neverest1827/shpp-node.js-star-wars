import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PersonModule } from './person/person.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { FilmModule } from './film/film.module';
import { SpecieModule } from './specie/specie.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { StarshipModule } from './starship/starship.module';
import { PlanetModule } from './planet/planet.module';
import { CommonModule } from './common/common.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorFilter } from './common/filters/error.filter';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { RolesGuard } from './role/role.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // To access ConfigService
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleAsyncOptions> =>
        ({
          type: configService.get<string>('DATABASE_TYPE'),
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/migrations/**/*.js'],
          synchronize: false,
        }) as TypeOrmModuleAsyncOptions,
      inject: [ConfigService], // Pass ConfigService as a dependency
    }),
    PersonModule,
    ImageModule,
    FilmModule,
    SpecieModule,
    VehicleModule,
    StarshipModule,
    PlanetModule,
    CommonModule,
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
