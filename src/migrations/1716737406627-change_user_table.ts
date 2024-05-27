import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserTable1716737406627 implements MigrationInterface {
  name = 'ChangeUserTable1716737406627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`userId\` \`userId\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userId\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`userId\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD PRIMARY KEY (\`userId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`userId\` \`userId\` int NOT NULL AUTO_INCREMENT`,
    );
  }
}
