import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImageTable1704050358898 implements MigrationInterface {
  name = 'CreateImageTable1704050358898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`image_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image_path\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`image_entity\``);
  }
}
