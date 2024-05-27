import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserTable11716737906039 implements MigrationInterface {
  name = 'ChangeUserTable11716737906039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`id\` \`userId\` int NOT NULL AUTO_INCREMENT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`userId\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
  }
}
