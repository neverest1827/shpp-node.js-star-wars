import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRole1724759116981 implements MigrationInterface {
  name = 'CreateRole1724759116981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`value\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_bb7d685810f5cba57e9ff6756f\` (\`value\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_bb7d685810f5cba57e9ff6756f\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
