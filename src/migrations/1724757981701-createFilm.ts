import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilm1724757981701 implements MigrationInterface {
  name = 'CreateFilm1724757981701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`films\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`title\` varchar(255) NOT NULL, 
    \`episode_id\` int NULL, 
    \`opening_crawl\` text NOT NULL, 
    \`director\` varchar(255) NOT NULL, 
    \`producer\` varchar(255) NOT NULL, 
    \`release_date\` varchar(255) NOT NULL,
    \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_ef6e0245decf772d1dd66f158a\` (\`title\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_ef6e0245decf772d1dd66f158a\` ON \`films\``,
    );
    await queryRunner.query(`DROP TABLE \`films\``);
  }
}
