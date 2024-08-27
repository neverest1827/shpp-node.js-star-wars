import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImage1724758698569 implements MigrationInterface {
  name = 'CreateImage1724758698569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`images\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`filename\` varchar(255) NOT NULL, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_3fed0dc195b842723edad36ada\` (\`filename\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3fed0dc195b842723edad36ada\` ON \`images\``,
    );
    await queryRunner.query(`DROP TABLE \`images\``);
  }
}
