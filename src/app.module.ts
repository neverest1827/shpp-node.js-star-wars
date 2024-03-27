import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleModule } from './people/people.module';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { ColorModule } from './color/color.module';
import { GenderModule } from './gender/gender.module';
import { FilmModule } from './film/film.module';
import { SpecieModule } from './specie/specie.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { StarshipModule } from './starship/starship.module';
import { PlanetModule } from './planet/planet.module';
import { CommonModule } from './common/common.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './response.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorFilter } from './error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Для доступа к ConfigService
      useFactory: async (configService: ConfigService) =>
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
      inject: [ConfigService], // Передача ConfigService в качестве зависимости
    }),
    PeopleModule,
    ImageModule,
    ColorModule,
    GenderModule,
    FilmModule,
    SpecieModule,
    VehicleModule,
    StarshipModule,
    PlanetModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
