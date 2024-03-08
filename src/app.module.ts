import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleModule } from './people/people.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { ColorModule } from './color/color.module';
import { GenderModule } from './gender/gender.module';
import { FilmModule } from './film/film.module';
import { SpecieModule } from './specie/specie.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { StarshipModule } from './starship/starship.module';
import { PlanetModule } from './planet/planet.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './response.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: 'Zaq1W2e34',
      database: 'star_wars',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/**/*.js'],
      synchronize: false,
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
  ],
})
export class AppModule {}
