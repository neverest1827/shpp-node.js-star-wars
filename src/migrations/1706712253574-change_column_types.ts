import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnTypes1706712253574 implements MigrationInterface {
  name = 'ChangeColumnTypes1706712253574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`specie\` DROP COLUMN \`average_height\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`average_height\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie\` DROP COLUMN \`average_lifespan\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`average_lifespan\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`specie\` DROP COLUMN \`average_lifespan\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`average_lifespan\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie\` DROP COLUMN \`average_height\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`average_height\` int NOT NULL`,
    );
  }
}
