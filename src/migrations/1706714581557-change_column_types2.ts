import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnTypes21706714581557 implements MigrationInterface {
  name = 'ChangeColumnTypes21706714581557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`specie\` CHANGE \`homeworld\` \`homeworld\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`specie\` CHANGE \`homeworld\` \`homeworld\` varchar(255) NOT NULL`,
    );
  }
}
