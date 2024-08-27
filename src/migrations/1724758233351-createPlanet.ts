import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanet1724758233351 implements MigrationInterface {
  name = 'CreatePlanet1724758233351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`planets\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`name\` varchar(255) NOT NULL, 
    \`rotation_period\` int NULL, 
    \`orbital_period\` int NULL, 
    \`diameter\` int NULL, 
    \`climate\` varchar(255) NOT NULL, 
    \`gravity\` varchar(255) NOT NULL, 
    \`terrain\` varchar(255) NOT NULL, 
    \`surface_water\` int NULL, 
    \`population\` bigint NULL, 
    \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_70a170f032a2ca04a6ec6eb2d9\` (\`name\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_70a170f032a2ca04a6ec6eb2d9\` ON \`planets\``,
    );
    await queryRunner.query(`DROP TABLE \`planets\``);
  }
}
