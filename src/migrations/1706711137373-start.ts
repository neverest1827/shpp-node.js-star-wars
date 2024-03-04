import { MigrationInterface, QueryRunner } from 'typeorm';

export class Start1706711137373 implements MigrationInterface {
  name = 'Start1706711137373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`planet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`rotation_period\` varchar(255) NOT NULL, \`orbital_period\` varchar(255) NOT NULL, \`diameter\` varchar(255) NOT NULL, \`climate\` varchar(255) NOT NULL, \`gravity\` varchar(255) NOT NULL, \`terrain\` varchar(255) NOT NULL, \`surface_water\` varchar(255) NOT NULL, \`population\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`starship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`manufacturer\` varchar(255) NOT NULL, \`cost_in_credits\` int NOT NULL, \`length\` int NOT NULL, \`max_atmosphering_speed\` int NOT NULL, \`crew\` int NOT NULL, \`passengers\` int NOT NULL, \`cargo_capacity\` int NOT NULL, \`consumables\` varchar(255) NOT NULL, \`hyperdrive_rating\` int NOT NULL, \`MGLT\` int NOT NULL, \`starship_class\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`vehicle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`manufacturer\` varchar(255) NOT NULL, \`cost_in_credits\` int NOT NULL, \`length\` int NOT NULL, \`max_atmosphering_speed\` int NOT NULL, \`crew\` int NOT NULL, \`passengers\` int NOT NULL, \`cargo_capacity\` int NOT NULL, \`consumables\` int NOT NULL, \`vehicle_class\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`specie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`classification\` varchar(255) NOT NULL, \`designation\` varchar(255) NOT NULL, \`average_height\` int NOT NULL, \`skin_colors\` varchar(255) NOT NULL, \`hair_colors\` varchar(255) NOT NULL, \`eye_colors\` varchar(255) NOT NULL, \`average_lifespan\` int NOT NULL, \`homeworld\` varchar(255) NOT NULL, \`language\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`film\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`episode_id\` int NOT NULL, \`opening_crawl\` text NOT NULL, \`director\` varchar(255) NOT NULL, \`producer\` varchar(255) NOT NULL, \`release_date\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image_path\` varchar(255) NOT NULL, \`people_id\` int NULL, \`film_id\` int NULL, \`planet_id\` int NULL, \`specie_id\` int NULL, \`starship_id\` int NULL, \`vehicle_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`gender\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`people\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`height\` varchar(255) NOT NULL, \`mass\` varchar(255) NOT NULL, \`birth_year\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`hair_color_id\` int NULL, \`skin_color_id\` int NULL, \`eye_color_id\` int NULL, \`gender_id\` int NULL, \`homeworld_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`color\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`planet_film\` (\`planetId\` int NOT NULL, \`filmId\` int NOT NULL, INDEX \`IDX_409c2d345fe137e93ddf31b7e1\` (\`planetId\`), INDEX \`IDX_125b7f62ac766fee86669ea3b1\` (\`filmId\`), PRIMARY KEY (\`planetId\`, \`filmId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`starship_film\` (\`starshipId\` int NOT NULL, \`filmId\` int NOT NULL, INDEX \`IDX_36fc9dd785c370cd2de59cd127\` (\`starshipId\`), INDEX \`IDX_cc8fecfae55bccc32bd8ff8d66\` (\`filmId\`), PRIMARY KEY (\`starshipId\`, \`filmId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`vehicle_film\` (\`vehicleId\` int NOT NULL, \`filmId\` int NOT NULL, INDEX \`IDX_35b75d6cd6729c714a9a8cc540\` (\`vehicleId\`), INDEX \`IDX_af89efe8554fe7b8283050e0aa\` (\`filmId\`), PRIMARY KEY (\`vehicleId\`, \`filmId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`specie_film\` (\`specieId\` int NOT NULL, \`filmId\` int NOT NULL, INDEX \`IDX_c8e796776b68297f2709101589\` (\`specieId\`), INDEX \`IDX_c03b4c41a28fa8dce25841484b\` (\`filmId\`), PRIMARY KEY (\`specieId\`, \`filmId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`people_film\` (\`peopleId\` int NOT NULL, \`filmId\` int NOT NULL, INDEX \`IDX_f9db368fbc066e71c65c0390d5\` (\`peopleId\`), INDEX \`IDX_d991656955065944e5f3e57980\` (\`filmId\`), PRIMARY KEY (\`peopleId\`, \`filmId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`people_specie\` (\`peopleId\` int NOT NULL, \`specieId\` int NOT NULL, INDEX \`IDX_f648f3daeca7437ecae6dd2fa9\` (\`peopleId\`), INDEX \`IDX_a4619a4ac866790c22df6796a7\` (\`specieId\`), PRIMARY KEY (\`peopleId\`, \`specieId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`people_vehicle\` (\`peopleId\` int NOT NULL, \`vehicleId\` int NOT NULL, INDEX \`IDX_cd1c62743f1d7ad6ea54142636\` (\`peopleId\`), INDEX \`IDX_fff91cb5a237602287746acee6\` (\`vehicleId\`), PRIMARY KEY (\`peopleId\`, \`vehicleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`people_starship\` (\`peopleId\` int NOT NULL, \`starshipId\` int NOT NULL, INDEX \`IDX_3a7e9a82073fae3d92f52e622e\` (\`peopleId\`), INDEX \`IDX_b9e9bc2d71ecef87855053c2ea\` (\`starshipId\`), PRIMARY KEY (\`peopleId\`, \`starshipId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_d16a89b7a02c4623fa878553da6\` FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_e29e541f3989b4567cf58a75b86\` FOREIGN KEY (\`film_id\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_29095a062ed12abc93b62c777ee\` FOREIGN KEY (\`planet_id\`) REFERENCES \`planet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_18d3836f38170385c22a792045c\` FOREIGN KEY (\`specie_id\`) REFERENCES \`specie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_9bd231d634994474739d3ac333b\` FOREIGN KEY (\`starship_id\`) REFERENCES \`starship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_fe92e8169046f3f488aca6c8b5b\` FOREIGN KEY (\`vehicle_id\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_c962397d26eaa714ff712c48d07\` FOREIGN KEY (\`hair_color_id\`) REFERENCES \`color\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_81d5b2389461e5b62ff81fccbbf\` FOREIGN KEY (\`skin_color_id\`) REFERENCES \`color\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_dbd6bf9593b8f581471e2dd5d9a\` FOREIGN KEY (\`eye_color_id\`) REFERENCES \`color\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_ed4cd9e77a17bbd51d3a97dc895\` FOREIGN KEY (\`gender_id\`) REFERENCES \`gender\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_a80a60ed539a57573be2dd1d89a\` FOREIGN KEY (\`homeworld_id\`) REFERENCES \`planet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`planet_film\` ADD CONSTRAINT \`FK_409c2d345fe137e93ddf31b7e1b\` FOREIGN KEY (\`planetId\`) REFERENCES \`planet\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`planet_film\` ADD CONSTRAINT \`FK_125b7f62ac766fee86669ea3b13\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship_film\` ADD CONSTRAINT \`FK_36fc9dd785c370cd2de59cd1277\` FOREIGN KEY (\`starshipId\`) REFERENCES \`starship\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship_film\` ADD CONSTRAINT \`FK_cc8fecfae55bccc32bd8ff8d66d\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle_film\` ADD CONSTRAINT \`FK_35b75d6cd6729c714a9a8cc540d\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle_film\` ADD CONSTRAINT \`FK_af89efe8554fe7b8283050e0aa0\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie_film\` ADD CONSTRAINT \`FK_c8e796776b68297f2709101589c\` FOREIGN KEY (\`specieId\`) REFERENCES \`specie\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie_film\` ADD CONSTRAINT \`FK_c03b4c41a28fa8dce25841484b1\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_film\` ADD CONSTRAINT \`FK_f9db368fbc066e71c65c0390d55\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_film\` ADD CONSTRAINT \`FK_d991656955065944e5f3e57980e\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_specie\` ADD CONSTRAINT \`FK_f648f3daeca7437ecae6dd2fa95\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_specie\` ADD CONSTRAINT \`FK_a4619a4ac866790c22df6796a79\` FOREIGN KEY (\`specieId\`) REFERENCES \`specie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_vehicle\` ADD CONSTRAINT \`FK_cd1c62743f1d7ad6ea54142636f\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_vehicle\` ADD CONSTRAINT \`FK_fff91cb5a237602287746acee65\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_starship\` ADD CONSTRAINT \`FK_3a7e9a82073fae3d92f52e622e3\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_starship\` ADD CONSTRAINT \`FK_b9e9bc2d71ecef87855053c2eaf\` FOREIGN KEY (\`starshipId\`) REFERENCES \`starship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`people_starship\` DROP FOREIGN KEY \`FK_b9e9bc2d71ecef87855053c2eaf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_starship\` DROP FOREIGN KEY \`FK_3a7e9a82073fae3d92f52e622e3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_vehicle\` DROP FOREIGN KEY \`FK_fff91cb5a237602287746acee65\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_vehicle\` DROP FOREIGN KEY \`FK_cd1c62743f1d7ad6ea54142636f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_specie\` DROP FOREIGN KEY \`FK_a4619a4ac866790c22df6796a79\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_specie\` DROP FOREIGN KEY \`FK_f648f3daeca7437ecae6dd2fa95\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_film\` DROP FOREIGN KEY \`FK_d991656955065944e5f3e57980e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people_film\` DROP FOREIGN KEY \`FK_f9db368fbc066e71c65c0390d55\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie_film\` DROP FOREIGN KEY \`FK_c03b4c41a28fa8dce25841484b1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie_film\` DROP FOREIGN KEY \`FK_c8e796776b68297f2709101589c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle_film\` DROP FOREIGN KEY \`FK_af89efe8554fe7b8283050e0aa0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle_film\` DROP FOREIGN KEY \`FK_35b75d6cd6729c714a9a8cc540d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship_film\` DROP FOREIGN KEY \`FK_cc8fecfae55bccc32bd8ff8d66d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship_film\` DROP FOREIGN KEY \`FK_36fc9dd785c370cd2de59cd1277\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`planet_film\` DROP FOREIGN KEY \`FK_125b7f62ac766fee86669ea3b13\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`planet_film\` DROP FOREIGN KEY \`FK_409c2d345fe137e93ddf31b7e1b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_a80a60ed539a57573be2dd1d89a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_ed4cd9e77a17bbd51d3a97dc895\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_dbd6bf9593b8f581471e2dd5d9a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_81d5b2389461e5b62ff81fccbbf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_c962397d26eaa714ff712c48d07\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_fe92e8169046f3f488aca6c8b5b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_9bd231d634994474739d3ac333b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_18d3836f38170385c22a792045c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_29095a062ed12abc93b62c777ee\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_e29e541f3989b4567cf58a75b86\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_d16a89b7a02c4623fa878553da6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b9e9bc2d71ecef87855053c2ea\` ON \`people_starship\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3a7e9a82073fae3d92f52e622e\` ON \`people_starship\``,
    );
    await queryRunner.query(`DROP TABLE \`people_starship\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fff91cb5a237602287746acee6\` ON \`people_vehicle\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cd1c62743f1d7ad6ea54142636\` ON \`people_vehicle\``,
    );
    await queryRunner.query(`DROP TABLE \`people_vehicle\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a4619a4ac866790c22df6796a7\` ON \`people_specie\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f648f3daeca7437ecae6dd2fa9\` ON \`people_specie\``,
    );
    await queryRunner.query(`DROP TABLE \`people_specie\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d991656955065944e5f3e57980\` ON \`people_film\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f9db368fbc066e71c65c0390d5\` ON \`people_film\``,
    );
    await queryRunner.query(`DROP TABLE \`people_film\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c03b4c41a28fa8dce25841484b\` ON \`specie_film\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c8e796776b68297f2709101589\` ON \`specie_film\``,
    );
    await queryRunner.query(`DROP TABLE \`specie_film\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_af89efe8554fe7b8283050e0aa\` ON \`vehicle_film\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_35b75d6cd6729c714a9a8cc540\` ON \`vehicle_film\``,
    );
    await queryRunner.query(`DROP TABLE \`vehicle_film\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_cc8fecfae55bccc32bd8ff8d66\` ON \`starship_film\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_36fc9dd785c370cd2de59cd127\` ON \`starship_film\``,
    );
    await queryRunner.query(`DROP TABLE \`starship_film\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_125b7f62ac766fee86669ea3b1\` ON \`planet_film\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_409c2d345fe137e93ddf31b7e1\` ON \`planet_film\``,
    );
    await queryRunner.query(`DROP TABLE \`planet_film\``);
    await queryRunner.query(`DROP TABLE \`color\``);
    await queryRunner.query(`DROP TABLE \`people\``);
    await queryRunner.query(`DROP TABLE \`gender\``);
    await queryRunner.query(`DROP TABLE \`image\``);
    await queryRunner.query(`DROP TABLE \`film\``);
    await queryRunner.query(`DROP TABLE \`specie\``);
    await queryRunner.query(`DROP TABLE \`vehicle\``);
    await queryRunner.query(`DROP TABLE \`starship\``);
    await queryRunner.query(`DROP TABLE \`planet\``);
  }
}
