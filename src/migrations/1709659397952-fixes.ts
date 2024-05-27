import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fixes1709659397952 implements MigrationInterface {
  name = 'Fixes1709659397952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`image\` DROP COLUMN \`image_path\``);
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD \`filename\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD \`imagePath\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`planet\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`planet\` ADD \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`planet\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`planet\` ADD \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`starship\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`starship\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`specie\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`specie\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`film\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`film\` ADD \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`film\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`film\` ADD \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD \`edited\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`people\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`people\` ADD \`created\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`film\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`film\` ADD \`edited\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`film\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`film\` ADD \`created\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`specie\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`edited\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`specie\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`specie\` ADD \`created\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`edited\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`vehicle\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`vehicle\` ADD \`created\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`starship\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`edited\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`starship\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`starship\` ADD \`created\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`planet\` DROP COLUMN \`edited\``);
    await queryRunner.query(
      `ALTER TABLE \`planet\` ADD \`edited\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`planet\` DROP COLUMN \`created\``);
    await queryRunner.query(
      `ALTER TABLE \`planet\` ADD \`created\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`image\` DROP COLUMN \`imagePath\``);
    await queryRunner.query(`ALTER TABLE \`image\` DROP COLUMN \`filename\``);
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD \`image_path\` varchar(255) NOT NULL`,
    );
  }
}
