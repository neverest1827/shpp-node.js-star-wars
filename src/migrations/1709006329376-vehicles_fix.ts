import { MigrationInterface, QueryRunner } from 'typeorm';

export class VehiclesFix1709006329376 implements MigrationInterface {
  name = 'VehiclesFix1709006329376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`cost_in_credits\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`cost_in_credits\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`length\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`length\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`max_atmosphering_speed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`max_atmosphering_speed\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`crew\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`crew\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`passengers\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`passengers\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`cargo_capacity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`cargo_capacity\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`cargo_capacity\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`cargo_capacity\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`passengers\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`passengers\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`crew\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`crew\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`max_atmosphering_speed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`max_atmosphering_speed\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`length\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`length\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` DROP COLUMN \`cost_in_credits\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`cost_in_credits\` int NOT NULL`,
    );
  }
}
