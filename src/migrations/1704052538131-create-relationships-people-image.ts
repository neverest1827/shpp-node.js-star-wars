import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationshipsPeopleImage1704052538131
  implements MigrationInterface
{
  name = 'CreateRelationshipsPeopleImage1704052538131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`image_entity\` ADD \`peopleId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image_entity\` ADD CONSTRAINT \`FK_9f99b37067756265e1f432a5b02\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`image_entity\` DROP FOREIGN KEY \`FK_9f99b37067756265e1f432a5b02\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image_entity\` DROP COLUMN \`peopleId\``,
    );
  }
}
