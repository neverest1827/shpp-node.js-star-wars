import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeople1724757448262 implements MigrationInterface {
  name = 'CreatePeople1724757448262';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`people\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`name\` varchar(255) NOT NULL, 
    \`height\` int NULL, 
    \`mass\` int NULL, 
    \`hair_color\` varchar(255) NOT NULL, 
    \`skin_color\` varchar(255) NOT NULL, 
    \`eye_color\` varchar(255) NOT NULL, 
    \`birth_year\` varchar(255) NOT NULL, 
    \`gender\` varchar(255) NOT NULL, 
    \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_e7ec00b080e693706a6eaa6d31\` (\`name\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e7ec00b080e693706a6eaa6d31\` ON \`people\``,
    );
    await queryRunner.query(`DROP TABLE \`people\``);
  }
}
