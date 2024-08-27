import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpecie1724758422978 implements MigrationInterface {
  name = 'CreateSpecie1724758422978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`species\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`name\` varchar(255) NOT NULL, 
    \`classification\` varchar(255) NOT NULL, 
    \`designation\` varchar(255) NOT NULL, 
    \`average_height\` int NULL, 
    \`skin_colors\` varchar(255) NOT NULL, 
    \`hair_colors\` varchar(255) NOT NULL, 
    \`eye_colors\` varchar(255) NOT NULL, 
    \`average_lifespan\` int NULL, 
    \`language\` varchar(255) NOT NULL, 
    \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_1adf701cac3b2c0f8bacb54774\` (\`name\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_1adf701cac3b2c0f8bacb54774\` ON \`species\``,
    );
    await queryRunner.query(`DROP TABLE \`species\``);
  }
}
