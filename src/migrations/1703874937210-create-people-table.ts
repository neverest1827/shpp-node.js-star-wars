import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeopleTable1703874937210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create table people_entity
(
    id         int auto_increment
        primary key,
    name       varchar(255) not null,
    height     varchar(255) not null,
    mass       varchar(255) not null,
    hair_color varchar(255) not null,
    skin_color varchar(255) not null,
    eye_color  varchar(255) not null,
    birth_year varchar(255) not null,
    gender     varchar(255) not null,
    homeworld  varchar(255) not null,
    films      varchar(255) not null,
    species    varchar(255) not null,
    vehicles   varchar(255) not null,
    starships  varchar(255) not null,
    created    varchar(255) not null,
    edited     varchar(255) not null,
    url        varchar(255) not null
)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE people_entity');
  }
}
