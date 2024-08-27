import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1724759012686 implements MigrationInterface {
  name = 'CreateUser1724759012686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`username\` varchar(255) NOT NULL, 
    \`password\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
