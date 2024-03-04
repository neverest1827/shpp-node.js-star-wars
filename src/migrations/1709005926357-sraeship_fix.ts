import { MigrationInterface, QueryRunner } from 'typeorm';

export class SraeshipFix1709005926357 implements MigrationInterface {
  name = 'SraeshipFix1709005926357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`cost_in_credits\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`cost_in_credits\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`max_atmosphering_speed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`max_atmosphering_speed\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`cargo_capacity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`cargo_capacity\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`hyperdrive_rating\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`hyperdrive_rating\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`starship\` DROP COLUMN \`MGLT\``);
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`MGLT\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`starship\` DROP COLUMN \`MGLT\``);
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`MGLT\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`hyperdrive_rating\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`hyperdrive_rating\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`cargo_capacity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`cargo_capacity\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`max_atmosphering_speed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`max_atmosphering_speed\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` DROP COLUMN \`cost_in_credits\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`cost_in_credits\` int NOT NULL`,
    );
  }
}
